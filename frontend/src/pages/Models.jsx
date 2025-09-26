import React from 'react';
import '../styles/models.css';

const Models = () => {
  const freeModels = [
    {
      name: "xAI: Grok 4 Fast",
      description: "Advanced AI model from xAI with fast response times",
      provider: "xAI",
      capabilities: ["Text Generation", "Code Assistance", "Creative Writing"],
      modelId: "x-ai/grok-4-fast:free"
    },
    {
      name: "NVIDIA: Nemotron Nano 9B V2",
      description: "Efficient AI model from NVIDIA optimized for various tasks",
      provider: "NVIDIA",
      capabilities: ["Text Generation", "Data Analysis", "Technical Support"],
      modelId: "nvidia/nemotron-nano-9b-v2:free"
    },
    {
      name: "DeepSeek: DeepSeek V3.1",
      description: "Powerful open-source AI model with advanced reasoning",
      provider: "DeepSeek",
      capabilities: ["Complex Reasoning", "Code Generation", "Research Assistance"],
      modelId: "deepseek/deepseek-chat-v3.1:free"
    },
    {
      name: "OpenAI: gpt-oss-20b",
      description: "Open-source variant of GPT with 20 billion parameters",
      provider: "OpenAI",
      capabilities: ["Natural Language Understanding", "Content Creation", "Translation"],
      modelId: "openai/gpt-oss-20b:free"
    }
  ];

  const premiumModels = [
    {
      name: "Google: Gemma 3n 2B",
      description: "Lightweight yet powerful model from Google",
      provider: "Google",
      capabilities: ["Efficient Processing", "Mobile Optimization", "Quick Responses"],
      modelId: "google/gemma-3n-e2b-it:free"
    },
    {
      name: "Meta: Llama 3.3 8B Instruct",
      description: "Latest iteration of Meta's Llama series with enhanced instruction following",
      provider: "Meta",
      capabilities: ["Instruction Following", "Multilingual Support", "Code Interpretation"],
      modelId: "meta-llama/llama-3.3-8b-instruct:free"
    },
    {
      name: "Dolphin3.0 Mistral 24B",
      description: "Specialized model optimized for helpful and harmless responses",
      provider: "Cognitive Computations",
      capabilities: ["Ethical AI", "Helpful Responses", "Safety Features"],
      modelId: "cognitivecomputations/dolphin3.0-mistral-24b:free"
    },
    {
      name: "MoonshotAI: Kimi Dev 72B",
      description: "Large-scale model with extensive knowledge and reasoning capabilities",
      provider: "MoonshotAI",
      capabilities: ["Extensive Knowledge", "Advanced Reasoning", "Multimodal Processing"],
      modelId: "moonshotai/kimi-dev-72b:free"
    }
  ];

  return (
    <div className="models-page">
      <section className="models-header">
        <div className="container">
          <h1>AI Models</h1>
          <p>Explore our collection of cutting-edge AI models</p>
        </div>
      </section>

      <section className="models-content">
        <div className="container">
          <div className="models-section">
            <h2>Free Models</h2>
            <p className="section-description">Available to all users</p>
            <div className="models-grid">
              {freeModels.map((model, index) => (
                <div key={index} className="model-card">
                  <div className="model-header">
                    <h3>{model.name}</h3>
                    <span className="model-provider">{model.provider}</span>
                  </div>
                  <p className="model-description">{model.description}</p>
                  <ul className="model-capabilities">
                    {model.capabilities.map((capability, idx) => (
                      <li key={idx}>{capability}</li>
                    ))}
                  </ul>
                  <div className="model-id">
                    <code>{model.modelId}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="models-section">
            <h2>Premium Models</h2>
            <p className="section-description">Available to premium users</p>
            <div className="models-grid">
              {premiumModels.map((model, index) => (
                <div key={index} className="model-card premium">
                  <div className="model-header">
                    <h3>{model.name}</h3>
                    <span className="model-provider">{model.provider}</span>
                  </div>
                  <p className="model-description">{model.description}</p>
                  <ul className="model-capabilities">
                    {model.capabilities.map((capability, idx) => (
                      <li key={idx}>{capability}</li>
                    ))}
                  </ul>
                  <div className="model-id">
                    <code>{model.modelId}</code>
                  </div>
                  <div className="premium-badge">Premium</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Models;