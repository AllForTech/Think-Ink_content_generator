import { generateAndStoreNewApiKey } from "@/lib/db/content";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  
    try {
        const { keyName } = await request.json();

        // 2. Input Validation
        if (!keyName || typeof keyName !== 'string' || keyName.trim().length === 0) {
            return NextResponse.json({ error: 'A valid key name is required.' }, { status: 400 });
        }

        // 3. Generate, Hash, and Store the new key
        const plainTextKey = await generateAndStoreNewApiKey(keyName.trim());

        // 4. Return the plaintext key (ONLY return it on creation!)
        return NextResponse.json({ 
            success: true, 
            plainTextKey: plainTextKey,
            message: "Key generated. Store this key securely, it will not be shown again."
        }, { status: 201 });

    } catch (error) {
        console.error('API Key Generation Error:', error);
        return NextResponse.json({ error: 'Failed to process key generation request.' }, { status: 500 });
    }
}
