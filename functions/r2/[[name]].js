// functions/r2/[[name]].js

export async function onRequest(context) {
  // 获取 URL 中的文件名
  const fileName = context.params.name;

  if (!fileName) {
    return new Response("Missing file name", { status: 400 });
  }

  // MY_BUCKET 是我们在后台绑定的变量名，下面步骤会教你设
  const object = await context.env.MY_BUCKET.get(fileName);

  if (object === null) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  
  // 关键：因为是同源代理，这里其实不需要CORS头了
  // 但为了保险，还是加上，允许你的网页随意访问
  headers.set("Access-Control-Allow-Origin", "*");

  return new Response(object.body, {
    headers,
  });
}
