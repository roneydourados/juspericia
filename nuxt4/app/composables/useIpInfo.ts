/**
 * Composable para capturar informações de IP interno e externo
 */
export const useIpInfo = () => {
  /**
   * Captura o IP interno do computador usando WebRTC
   */
  const getInternalIp = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      try {
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        pc.createDataChannel("");

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const candidate = event.candidate.candidate;
            const ipMatch = candidate.match(
              /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
            );

            if (ipMatch && ipMatch[0]) {
              const ip = ipMatch[0];
              // Verifica se é um IP privado (não público)
              if (isPrivateIp(ip)) {
                pc.close();
                resolve(ip);
                return;
              }
            }
          }
        };

        pc.createOffer()
          .then((offer) => pc.setLocalDescription(offer))
          .catch(() => resolve(null));

        // Timeout após 5 segundos
        setTimeout(() => {
          pc.close();
          resolve(null);
        }, 5000);
      } catch (error) {
        console.error("Erro ao capturar IP interno:", error);
        resolve(null);
      }
    });
  };

  /**
   * Captura o IP externo do computador usando serviço externo
   */
  const getExternalIp = async (): Promise<string | null> => {
    try {
      // Tenta múltiplos serviços para maior confiabilidade
      const services = [
        "https://api.ipify.org?format=json",
        "https://ipapi.co/json/",
        "https://httpbin.org/ip",
      ];

      for (const service of services) {
        try {
          const response = await fetch(service, {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            signal: AbortSignal.timeout(5000),
          });

          if (response.ok) {
            const data = await response.json();

            // Diferentes serviços retornam o IP em campos diferentes
            const ip = data.ip || data.query || data.origin;

            if (ip && isValidIp(ip)) {
              return ip;
            }
          }
        } catch (serviceError) {
          console.warn(`Falha no serviço ${service}:`, serviceError);
          continue;
        }
      }

      return null;
    } catch (error) {
      console.error("Erro ao capturar IP externo:", error);
      return null;
    }
  };

  /**
   * Captura ambos os IPs (interno e externo) simultaneamente
   */
  const getIpInfo = async () => {
    try {
      const [internalIp, externalIp] = await Promise.all([
        getInternalIp(),
        getExternalIp(),
      ]);

      return {
        internalIp,
        externalIp,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Erro ao capturar informações de IP:", error);
      return {
        internalIp: null,
        externalIp: null,
        timestamp: new Date().toISOString(),
      };
    }
  };

  /**
   * Verifica se um IP é privado (interno)
   */
  const isPrivateIp = (ip: string): boolean => {
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^169\.254\./,
      /^fc00:/,
      /^fe80:/,
      /^::1$/,
    ];

    return privateRanges.some((range) => range.test(ip));
  };

  /**
   * Valida se uma string é um IP válido
   */
  const isValidIp = (ip: string): boolean => {
    const ipv4Regex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  return {
    getInternalIp,
    getExternalIp,
    getIpInfo,
    isPrivateIp,
    isValidIp,
  };
};

// Tipos para TypeScript
export interface IpInfo {
  internalIp: string | null;
  externalIp: string | null;
  timestamp: string;
}
