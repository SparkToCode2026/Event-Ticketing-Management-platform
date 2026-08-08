import { useEffect } from "react";

function Chatbot() {

  useEffect(() => {

    const script = document.createElement("script");

    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "ToAASmzb36Dbx96qngDsS";
    script.setAttribute("domain", "www.chatbase.co");

    document.body.appendChild(script);

    return () => {
      script.remove();
    };

  }, []);

  return null;
}

export default Chatbot;