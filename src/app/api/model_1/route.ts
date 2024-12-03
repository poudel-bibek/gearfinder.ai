import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct-fast`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant on the website \"gearfinder.ai\" which helps users (beginners) find the right gear for activities they are interested to pursue. Given the user query below, your task is to generate a list of items related to the activity. For each item, you must include both a name and a description in the following exact format:\n\n{\n  \"item1\": {\"name\": \"Item 1 Name\", \"description\": \"Item 1 Description\"},\n  \"item2\": {\"name\": \"Item 2 Name\", \"description\": \"Item 2 Description\"}\n}\n\n In the description, include details about the items like weight, size, etc. that a person would search in Google. Rules:\n- DO NOT use nested objects or categories\n- DO NOT use special characters (quotes, inches, etc)\n- Each description should be concise (max 6 words)\n- Include measurements in metric units when relevant\n- Order items from most essential to optional\n- Output must be valid JSON\n- Output only the JSON object, nothing else\n- Each item must have both name and description fields\n- Use simple alphanumeric keys (item1, item2, etc). \nAlways maintain strict adherence to the format. \n\nUser query: "
            },
            {
              role: "user",
              content: prompt
            }
          ],
          stream: false
        }),
      }
    );

    const data = await response.json();
    console.log('Model Response:', data.result.response);
    
    // Parse the response string into an object
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(data.result.response);
      console.log('Parsed Response:', parsedResponse);
    } catch (error) {
      console.error('Error parsing model response:', error);
      return NextResponse.json({ error: 'Failed to parse model response' }, { status: 500 });
    }
    
    // Save results to JSON file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '');
    const results = {
      query: prompt,
      response: data.result.response
    };
    
    // Create directory if it doesn't exist
    const resultsDir = path.join(process.cwd(), 'model_1_results');
    try {
      await mkdir(resultsDir, { recursive: true });
    } catch (err: any) {
      if (err.code !== 'EEXIST') throw err;
    }
    
    const filePath = path.join(resultsDir, `results_${timestamp}.json`);
    await writeFile(filePath, JSON.stringify(results, null, 2));

    // Return the parsed response
    const responseData = { 
      result: {
        response: parsedResponse
      }
    };
    console.log('Sending to frontend:', responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
} 