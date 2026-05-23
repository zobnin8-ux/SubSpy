export interface Env {
  EMAIL_INTAKE_SECRET: string;
  INTAKE_URL: string;
}

export default {
  async email(message: ForwardableEmailMessage, env: Env): Promise<void> {
    const to = message.to.toLowerCase();
    const alias = to.split("@")[0];

    const reader = message.raw.getReader();
    const chunks: Uint8Array[] = [];
    let done = false;

    while (!done) {
      const result = await reader.read();
      done = result.done;
      if (result.value) chunks.push(result.value);
    }

    const raw = new TextDecoder().decode(
      chunks.reduce((acc, chunk) => {
        const merged = new Uint8Array(acc.length + chunk.length);
        merged.set(acc);
        merged.set(chunk, acc.length);
        return merged;
      }, new Uint8Array())
    );

    const fromMatch = raw.match(/^From: (.+)$/m);
    const subjectMatch = raw.match(/^Subject: (.+)$/m);
    const bodyStart = raw.indexOf("\r\n\r\n");
    const body = bodyStart >= 0 ? raw.slice(bodyStart + 4) : raw;

    await fetch(env.INTAKE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-subspy-secret": env.EMAIL_INTAKE_SECRET,
      },
      body: JSON.stringify({
        alias,
        from: fromMatch?.[1]?.trim() ?? "unknown",
        subject: subjectMatch?.[1]?.trim() ?? "(no subject)",
        text: body.slice(0, 50000),
      }),
    });
  },
};
