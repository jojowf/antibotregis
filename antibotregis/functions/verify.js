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

    if (!result.success || result.score < 0.5) {
      return Response.json({
        success: false
      });
    }

    return Response.json({
        success: true,
        redirect: "https://example.com"
    });

  } catch (err) {
    return Response.json({
      success: false,
      error: err.message
    });
  }
}