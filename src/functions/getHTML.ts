import axios from "axios";

const getHTML = async (
  url: string = "https://lelscans.net"
): Promise<string> => {
  const res = await axios(url);
  const html = await res.data;

  return html;
};

export default getHTML;
