import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const msg = message.toLowerCase();
    let reply = 'I can help you navigate the MVGR campus! Try asking about specific buildings or departments.';
    if (msg.includes('cse')) reply = 'The CSE Department is in the southern area near ECE. 4 floors with labs.';
    else if (msg.includes('library')) reply = 'Central Library is in the central-north area. 3 floors.';
    else if (msg.includes('canteen')) reply = 'MVGR Canteen is in the northwest section.';
    else if (msg.includes('event')) reply = 'Check the Events section on the Visitor Dashboard.';
    else if (msg.includes('help')) reply = 'I can help find buildings, navigate, and check events!';
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
