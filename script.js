// Aage chal kar yahan apni Gemini API Key daalein
const GEMINI_API_KEY = "AIzaSyBo0LBMY4vZdsi5x9QPjvWHsgAUPRGS8lM"; 

// Function to generate news using Gemini API
async function generateAINews() {
    const prompt = "Write 3 short, trending news articles about Artificial Intelligence and its impact on Geopolitics. Format it as a JSON array where each object has 'title', 'category' (either 'AI Trend' or 'Geopolitics'), 'summary', and 'toolMention' (if any specific AI tool is mentioned).";

    try {
        // Yeh Gemini API ka standard endpoint hai (Note: Update version as per latest docs)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error("API call failed. Please check your API key.");
        }

        const data = await response.json();
        
        // Gemini ke response se text extract karna (Assuming it returns formatted JSON text)
        let responseText = data.candidates[0].content.parts[0].text;
        
        // Formatting safety: Removing markdown JSON blocks if Gemini returns them
        responseText = responseText.replace(/```json/g, "").replace(/```/g, "");
        const newsData = JSON.parse(responseText);

        displayNews(newsData);

    } catch (error) {
        console.error("Error fetching news:", error);
        document.getElementById('news-feed').innerHTML = `<p style="color: red; text-align: center;">Unable to fetch news right now. (Add your API key in script.js)</p>`;
        
        // Fallback mockup data dikhane ke liye agar API key na ho:
        displayMockNews();
    }
}

// Function to render news on the website
function displayNews(newsArray) {
    const newsFeed = document.getElementById('news-feed');
    newsFeed.innerHTML = ''; // Loading text ko clear karna

    newsArray.forEach(news => {
        // Placeholder image based on category
        const imgUrl = news.category.includes('Geopolitics') 
            ? 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=800&auto=format&fit=crop' 
            : 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop';

        const articleHTML = `
            <article class="news-card">
                <img src="${imgUrl}" alt="${news.title}" class="news-image">
                <div class="news-content">
                    <span class="news-category">${news.category}</span>
                    <h2 class="news-title">${news.title}</h2>
                    <p class="news-summary">${news.summary}</p>
                    ${news.toolMention ? `<p style="margin-top:10px; font-size: 0.9rem;"><strong>Related Tool:</strong> <a href="#" style="color:#06b6d4;">${news.toolMention}</a></p>` : ''}
                </div>
            </article>
        `;
        newsFeed.innerHTML += articleHTML;
    });
}

// Dummy data if API key is not yet added
function displayMockNews() {
    const mockData = [
        {
            title: "Global Summit Agrees on New AI Regulatory Framework",
            category: "Geopolitics",
            summary: "World leaders gathered today to discuss the strategic implications of generative AI, drafting a treaty to manage open-source military AI developments globally.",
            toolMention: null
        },
        {
            title: "New Code Generation Model Disrupts Software Industry",
            category: "AI Trend",
            summary: "A newly released autonomous coding agent is making waves by building complete web applications from simple text prompts in seconds.",
            toolMention: "Devin AI"
        }
    ];
    displayNews(mockData);
}

// Website load hote hi function run karein
window.onload = generateAINews;
