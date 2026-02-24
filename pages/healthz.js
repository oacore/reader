export async function getServerSideProps({ res }) {
  res.statusCode = 200;
  res.setHeader("content-type", "text/plain");
  res.end("ok");
  return { props: {} };
}

export default function Healthz() { return null; }
