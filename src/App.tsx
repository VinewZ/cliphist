import { useEffect, useState } from "react"
import { useTheme } from '../providers/theme.tsx';
import { createClient } from "../../clutchRPC/ts"
import { name } from "../package.json"
import { Input } from "./components/ui/input.tsx";

const client = createClient(9023)

export function App() {
  const { setTheme } = useTheme();
  const [list, setList] = useState("")

  async function getList() {

    const shell = await client.useShell({
      appName: name,
      command: `cliphist list | head -n 20 | awk '{print $1}' | xargs -n1 cliphist decode`,
      timeoutMs: 30000
    })

    setList(shell.output)
    console.log(shell)
  }

  useEffect(() => {
    window.parent.postMessage({ type: "clutch-extension-ready" }, "*");
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "theme") setTheme(e.data.theme);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    getList()
  }, [])

  return (
    <div>
    <Input/>
    <div>
      {list.split(`\n`).map((line, i) => (
        <div key={i} className="text-white">
          {line}
        </div>
      ))}
    </div>
    </div>
  )
}
