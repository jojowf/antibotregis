export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { token } = await request.json();

    if (!token) {
      return Response.json({
        success: false,
        message: "Missing token"
      });
    }

    const form = new URLSearchParams();
    form.append("secret", env.RECAPTCHA_SECRET);
    form.append("response", token);

    const google = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        body: form
      }
    );

    const result = await google.json();

    // DEBUG
    return Response.json(result);

  } catch (err) {
    return Response.json({
      success: false,
      error: err.message
    });
  }
}
