import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="id" class="dark">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Jules Cloudflare Worker Builder</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
        tailwind.config = {
          darkMode: 'class',
          theme: {
            extend: {
              colors: {
                luxury: {
                  900: '#0f172a',
                  800: '#1e293b',
                  700: '#334155',
                  accent: '#8b5cf6', // Violet
                  glow: '#a78bfa',
                }
              },
              animation: {
                'gradient-x': 'gradient-x 15s ease infinite',
              },
              keyframes: {
                'gradient-x': {
                  '0%, 100%': {
                    'background-size': '200% 200%',
                    'background-position': 'left center'
                  },
                  '50%': {
                    'background-size': '200% 200%',
                    'background-position': 'right center'
                  },
                },
              }
            }
          }
        }
      </script>
      <style>
        body {
          background: linear-gradient(-45deg, #0f172a, #1e1b4b, #312e81, #0f172a);
          background-size: 400% 400%;
          animation: gradient-x 15s ease infinite;
        }
        .glass-panel {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .input-luxury {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: white;
          transition: all 0.3s ease;
        }
        .input-luxury:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
          outline: none;
        }
      </style>
    </head>
    <body class="text-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div class="max-w-xl mx-auto glass-panel rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.005] duration-500">
        <div class="px-8 py-10">
          <div class="text-center mb-10">
            <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-2 tracking-tight">
              Jules Worker Builder
            </h1>
            <p class="text-slate-300 text-sm font-light tracking-wide uppercase">AI-Powered Cloudflare Deployment</p>
          </div>

          <form id="deployForm" class="space-y-6">
            <div class="grid grid-cols-1 gap-6">
              <!-- Credentials Section -->
              <div class="space-y-4">
                <div>
                  <label for="cfAccountId" class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Cloudflare Account ID</label>
                  <input type="text" id="cfAccountId" name="cfAccountId" required
                    class="input-luxury w-full rounded-lg py-3 px-4 shadow-sm placeholder-slate-500 text-sm" placeholder="Account ID">
                </div>

                <div>
                  <label for="cfApiToken" class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Cloudflare API Token</label>
                  <input type="password" id="cfApiToken" name="cfApiToken" required
                    class="input-luxury w-full rounded-lg py-3 px-4 shadow-sm placeholder-slate-500 text-sm" placeholder="••••••••••••••••">
                </div>

                <div>
                  <label for="googleApiKey" class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Google AI (Jules) API Key</label>
                  <input type="password" id="googleApiKey" name="googleApiKey" required
                    class="input-luxury w-full rounded-lg py-3 px-4 shadow-sm placeholder-slate-500 text-sm" placeholder="••••••••••••••••">
                </div>
              </div>

              <!-- Configuration Section -->
              <div class="space-y-4 pt-4 border-t border-slate-700/50">
                 <div>
                  <label for="aiModel" class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Model AI</label>
                  <select id="aiModel" name="aiModel" required
                    class="input-luxury w-full rounded-lg py-3 px-4 shadow-sm text-sm appearance-none bg-slate-900">
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (New)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (New)</option>
                    <option value="gemini-3.0-flash">Gemini 3.0 Flash (Preview)</option>
                    <option value="gemini-3.0-pro">Gemini 3.0 Pro (Preview)</option>
                    <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Experimental)</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Legacy)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Legacy)</option>
                  </select>
                </div>

                <div>
                  <label for="workerName" class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Nama Worker</label>
                  <input type="text" id="workerName" name="workerName" placeholder="my-ai-worker" required
                    class="input-luxury w-full rounded-lg py-3 px-4 shadow-sm placeholder-slate-500 text-sm">
                </div>

                <div>
                  <label for="prompt" class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Perintah (Prompt)</label>
                  <textarea id="prompt" name="prompt" rows="4" required placeholder="Jelaskan worker yang ingin Anda buat..."
                    class="input-luxury w-full rounded-lg py-3 px-4 shadow-sm placeholder-slate-500 text-sm resize-none"></textarea>
                </div>
              </div>
            </div>

            <div class="pt-4">
              <button type="submit" id="submitBtn"
                class="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500 transform transition hover:-translate-y-0.5 active:translate-y-0">
                🚀 Buat & Deploy Worker
              </button>
            </div>
          </form>

          <div id="status" class="mt-8 hidden transition-all duration-300 ease-in-out">
            <div class="rounded-xl bg-slate-800/80 border border-slate-700 p-5 backdrop-blur-sm">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                   <svg id="statusIcon" class="h-6 w-6 text-violet-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                </div>
                <div class="ml-4 w-full">
                  <h3 class="text-sm font-bold text-violet-200" id="statusTitle">Memproses...</h3>
                  <div class="mt-2 text-sm text-slate-300">
                    <p id="statusMessage">Sedang menghubungi Jules...</p>
                    <div id="codeOutput" class="hidden mt-3">
                       <pre class="bg-slate-950 p-3 rounded-lg text-xs font-mono text-green-400 overflow-x-auto border border-slate-800 scrollbar-thin scrollbar-thumb-slate-700"></pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center text-slate-500 text-xs">
        &copy; 2024 Jules Worker Builder. Powered by Cloudflare & Google AI.
      </div>

      <script>
        document.getElementById('deployForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const form = e.target;
          const statusDiv = document.getElementById('status');
          const statusTitle = document.getElementById('statusTitle');
          const statusMessage = document.getElementById('statusMessage');
          const statusIcon = document.getElementById('statusIcon');
          const submitBtn = document.getElementById('submitBtn');
          const codeOutput = document.getElementById('codeOutput');
          const preTag = codeOutput.querySelector('pre');

          // UI Update
          statusDiv.classList.remove('hidden');
          statusDiv.classList.add('fade-in');
          statusTitle.textContent = 'Memproses...';
          statusTitle.className = 'text-sm font-bold text-violet-200';
          statusMessage.textContent = 'Sedang menghubungi Jules untuk membuat kode...';
          statusIcon.className = 'h-6 w-6 text-violet-400 animate-pulse';
          codeOutput.classList.add('hidden');

          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="animate-spin inline-block mr-2">⟳</span> Memproses...';
          submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());

          try {
            const response = await fetch('/api/deploy', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
              statusTitle.textContent = 'Berhasil!';
              statusTitle.className = 'text-sm font-bold text-green-400';
              statusMessage.textContent = 'Worker berhasil dideploy ke akun Cloudflare Anda.';
              statusIcon.className = 'h-6 w-6 text-green-400';
              statusIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />';

              preTag.textContent = result.code;
              codeOutput.classList.remove('hidden');
            } else {
              throw new Error(result.error || 'Terjadi kesalahan saat deploy.');
            }
          } catch (error) {
            statusTitle.textContent = 'Gagal';
            statusTitle.className = 'text-sm font-bold text-red-400';
            statusMessage.textContent = error.message;
            statusIcon.className = 'h-6 w-6 text-red-400';
            statusIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />';
            codeOutput.classList.add('hidden');
          } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '🚀 Buat & Deploy Worker';
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
          }
        });
      </script>
    </body>
    </html>
  `)
})

app.post('/api/deploy', async (c) => {
  try {
    const body = await c.req.json()
    const { cfAccountId, cfApiToken, googleApiKey, workerName, prompt, aiModel } = body

    if (!cfAccountId || !cfApiToken || !googleApiKey || !workerName || !prompt) {
      return c.json({ error: 'Semua field harus diisi.' }, 400)
    }

    const selectedModel = aiModel || 'gemini-1.5-flash' // Default if not provided

    // 1. Generate Code using Google AI (Jules)
    let generatedCode: string
    try {
      generatedCode = await generateWorkerCode(googleApiKey, prompt, selectedModel)
    } catch (err: any) {
      return c.json({ error: err.message || 'Gagal membuat kode worker dari AI.' }, 500)
    }

    // 2. Deploy to Cloudflare
    const deploySuccess = await deployToCloudflare(cfAccountId, cfApiToken, workerName, generatedCode)

    if (!deploySuccess) {
      return c.json({ error: 'Gagal deploy ke Cloudflare. Cek kredensial Anda.' }, 502)
    }

    return c.json({ success: true, code: generatedCode })
  } catch (err: any) {
    return c.json({ error: err.message || 'Terjadi kesalahan internal.' }, 500)
  }
})

async function generateWorkerCode(apiKey: string, userPrompt: string, model: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const systemInstruction = `
    You are an expert Cloudflare Worker developer.
    Your task is to write a COMPLETE Cloudflare Worker script using ES Module syntax (export default { fetch: ... }).
    The code must be ready to deploy.
    IMPORTANT: DO NOT use external libraries (like 'hono', 'itty-router', 'cheerio', etc.) because the user cannot install dependencies.
    Use ONLY standard Web APIs (Request, Response, URL, fetch) available in the Cloudflare Workers runtime.
    DO NOT include markdown formatting (like \`\`\`javascript).
    DO NOT include explanations.
    ONLY return the JavaScript code.
  `

  const payload = {
    contents: [{
      parts: [{
        text: `${systemInstruction}\n\nRequirement: ${userPrompt}`
      }]
    }]
  }

  // Error handling is done by the caller
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  const data: any = await response.json()

  if (!response.ok) {
    console.error('Google AI API Error:', data)
    throw new Error(data.error?.message || 'Error calling Google AI: ' + JSON.stringify(data.error))
  }

  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

  // Clean up potential markdown if the AI ignores instruction
  text = text.replace(/^```javascript\s*/, '').replace(/^```\s*/, '').replace(/```$/, '')

  return text.trim()
}

async function deployToCloudflare(accountId: string, apiToken: string, scriptName: string, code: string): Promise<boolean> {
  // Cloudflare API expects the script content.
  // For ES Modules, we should ideally use the multipart/form-data approach if we want to set metadata (like main_module),
  // but for simple single-file workers, putting the code in the body often works or we use the specific endpoint behavior.
  // We will assume a standard fetch handler in the code.

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${scriptName}`

  try {
    // We need to use FormData to upload the script properly as a module usually,
    // or just send the file content with the correct content-type.
    // Cloudflare API v4 for uploading a worker script:
    // PUT /accounts/{account_id}/workers/scripts/{script_name}
    // Content-Type: application/javascript or multipart/form-data

    // Let's try sending as raw javascript first.
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/javascript'
      },
      body: code
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Cloudflare Deployment Error:', errorData)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deploying to Cloudflare:', error)
    return false
  }
}

export default app
