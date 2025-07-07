// ✅ /server/utils/groqService.js

const { Groq } = require('groq-sdk');

// Proper instantiation of the client
const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.analyzeWithGroq = async (inventoryItems, orders) => {
  const prompt = `
You are an inventory and sentiment expert. Based on the stock data and customer feedback:

1. Recommend optimal prices: if stock is low (less than threshold), increase price; if it's 3x over threshold, suggest reducing it.
2. Analyze sentiment from orders and advise which products need improvement.

Inventory:
${JSON.stringify(inventoryItems)}

Orders:
${JSON.stringify(orders)}
`;

  try {
    const response = await groqClient.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        { role: 'system', content: 'You analyze inventory and customer feedback.' },
        { role: 'user', content: prompt },
      ],
    });

    const output = response.choices?.[0]?.message?.content;

    return {
      priceSuggestions: inventoryItems.map((item) => {
        const suggestedPrice =
          item.quantity < item.threshold
            ? Math.round(item.price * 1.1)
            : item.quantity > item.threshold * 3
            ? Math.round(item.price * 0.95)
            : item.price;

        return {
          name: item.name,
          currentPrice: item.price,
          suggestedPrice,
        };
      }),
      sentimentFeedback: inventoryItems.map((item) => {
        const itemOrders = orders.filter((o) =>
          o.items.some((i) => i.product === item.name)
        );
        const sentiments = itemOrders.map((o) => o.sentiment);
        const score = sentiments.reduce(
          (acc, s) => acc + (s === 'positive' ? 1 : s === 'negative' ? -1 : 0),
          0
        );

        return {
          name: item.name,
          sentiment:
            score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
          note:
            score < 0
              ? 'Consider improving this item based on feedback.'
              : 'No major issues noted.',
        };
      }),
      rawOutput: output, // Optional: include Groq response for future parsing
    };
  } catch (err) {
    console.error('Error using Groq API:', err.message);

    // Return fallback if Groq fails
    return {
      priceSuggestions: inventoryItems.map((item) => {
        const suggestedPrice =
          item.quantity < item.threshold
            ? Math.round(item.price * 1.1)
            : item.quantity > item.threshold * 3
            ? Math.round(item.price * 0.95)
            : item.price;

        return {
          name: item.name,
          currentPrice: item.price,
          suggestedPrice,
        };
      }),
      sentimentFeedback: inventoryItems.map((item) => {
        const itemOrders = orders.filter((o) =>
          o.items.some((i) => i.product === item.name)
        );
        const sentiments = itemOrders.map((o) => o.sentiment);
        const score = sentiments.reduce(
          (acc, s) => acc + (s === 'positive' ? 1 : s === 'negative' ? -1 : 0),
          0
        );

        return {
          name: item.name,
          sentiment:
            score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
          note:
            score < 0
              ? 'Consider improving this item based on feedback.'
              : 'No major issues noted.',
        };
      }),
      rawOutput: null,
    };
  }
};
