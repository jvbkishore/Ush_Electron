import axios from 'axios';

const AI_BACKEND_URL = 'https://api.cohere.com/v2/chat'; // Cohere API endpoint
const COHERE_API_KEY = ''; // Replace this with your actual API key
//key:tVi4E2kzDVjvqS9WwoZ3Acf3LMXmW4AXWN775Amv
export const getAIResponse = async (query: string): Promise<string> => {
    try {
      

        const prompt  = query +`    Respond as interviewee. Provide 4 to 5 lines summmary. Tone should be professional and coversational and sound confident.`;
       

        console.log('Sending request to AI backend:', prompt);
        const requestBody = {
            model: 'command-a-03-2025',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        };

        const response = await axios.post(
            AI_BACKEND_URL,
            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${COHERE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('AI response received:', response.data);
        return response.data.message.content[0].text; // Adjust if needed based on actual response
    } catch (error) {
        console.error('Error getting AI response:', error);
        throw new Error('Failed to get AI response');
    }
};
