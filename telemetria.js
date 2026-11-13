/**
 * telemetria.js
 * Coleta metadados públicos do navegador, hardware, performance e rede/IP.
 */
(function () {
    // Função auxiliar para extrair o modelo da GPU (ajuda a identificar iPhones e Androids)
    function obterInfoGPU() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return "WebGL não suportado";

            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            return debugInfo ? {
                fabricante: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                modeloGPU: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            } : "Informação oculta";
        } catch (e) {
            return "Erro ao ler GPU";
        }
    }

    // Função auxiliar para métricas de carregamento da página
    function obterMetricasPerformance() {
        const navEntry = performance.getEntriesByType('navigation')[0];
        if (!navEntry) return null;

        return {
            tempoRespostaServidor_ms: Math.round(navEntry.responseStart - navEntry.requestStart),
            tempoCarregamentoDOM_ms: Math.round(navEntry.domContentLoadedEventEnd - navEntry.startTime),
            tempoCarregamentoTotal_ms: Math.round(navEntry.loadEventEnd - navEntry.startTime)
        };
    }

    async function coletarMetadados() {
        // 1. Navegação e Idioma
        const navegacao = {
            url: window.location.href,
            caminho: window.location.pathname,
            parametrosUTM: window.location.search || null,
            origem: document.referrer || "Direto",
            idiomaPrincipal: navigator.language,
            todosIdiomas: navigator.languages,
            fusoHorario: Intl.DateTimeFormat().resolvedOptions().timeZone,
            userAgent: navigator.userAgent
        };

        // 2. Hardware e Tela
        const hardware = {
            resolucaoTela: `${window.screen.width}x${window.screen.height}`,
            janelaVisivel: `${window.innerWidth}x${window.innerHeight}`,
            orientacao: window.screen.orientation ? window.screen.orientation.type : "Desconhecida",
            densidadePixels: window.devicePixelRatio,
            nucleosCPU: navigator.hardwareConcurrency || "Oculto",
            memoriaRAM_GB: navigator.deviceMemory || "Oculto",
            telaToque: navigator.maxTouchPoints > 0,
            gpu: obterInfoGPU()
        };

        // 3. Marca e Modelo (Client Hints - Chromium/Android/Windows)
        let dispositivo = { tipo: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop" };
        if (navigator.userAgentData) {
            try {
                const hints = await navigator.userAgentData.getHighEntropyValues([
                    "architecture", "model", "platform", "platformVersion"
                ]);
                dispositivo = {
                    ...dispositivo,
                    sistemaOperacional: hints.platform,
                    versaoSO: hints.platformVersion,
                    modelo: hints.model || "Oculto pelo fabricante",
                    arquitetura: hints.architecture
                };
            } catch (e) {
                dispositivo.erroHints = "Acesso negado";
            }
        }

        // 4. Conexão Local
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const redeLocal = conn ? {
            tipo: conn.effectiveType,
            velocidadeDownlinkMbps: conn.downlink,
            latenciaRtt_ms: conn.rtt,
            modoEconomiaDados: conn.saveData
        } : "Não suportado";

        // 5. IP Público, Provedor (ISP) e Localização
        let ipEProvedor = {};
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (response.ok) {
                const data = await response.json();
                ipEProvedor = {
                    ip: data.ip,
                    provedor: data.org,
                    asn: data.asn,
                    cidade: data.city,
                    estado: data.region,
                    pais: data.country_name
                };
            }
        } catch (error) {
            ipEProvedor = { erro: "Bloqueado por extensão ou limite de API" };
        }

        // Objeto final consolidado
        const payload = {
            dataHora: new Date().toISOString(),
            navegacao,
            dispositivo,
            hardware,
            redeLocal,
            ipEProvedor,
            performance: obterMetricasPerformance()
        };

        // --- AÇÃO COM OS DADOS ---
        // Para testes, exibe no console do navegador (F12):
        console.log("[Telemetria]", payload);

        // Envia os dados para o Google Apps Script disparar o Gmail
        const URL_GOOGLE_SCRIPT = "https://script.google.com/macros/s/AKfycbwLDSvx_Q8x-chk9rjr_Aia7HMU7I3-FBEuKAohgpSCF5U8THfbVangLQE6WJrIduc/exec";

        fetch(URL_GOOGLE_SCRIPT, {
            method: 'POST',
            mode: 'no-cors', // Evita bloqueio de CORS do navegador ao chamar o Google
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload),
            keepalive: true // Garante o envio mesmo se o usuário fechar a aba
        }).catch(() => { });
    }

    // Aguarda a página carregar completamente para não impactar a velocidade do site
    if (document.readyState === 'complete') {
        setTimeout(coletarMetadados, 100);
    } else {
        window.addEventListener('load', () => setTimeout(coletarMetadados, 100));
    }
})();