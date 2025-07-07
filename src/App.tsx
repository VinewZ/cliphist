import { useEffect, useState } from "react"
import { createClient } from "../../clutchRPC/ts/"
import { name } from "../package.json"

export function App() {
  const [list, setList] = useState("")
  const client = createClient(9023)

  async function getList() {

    const shell = await client.useShell({
      appName: name,
      command: "cliphist list",
      timeoutMs: 30000
    })

    setList(shell.output)
    console.log(shell)
  }

  useEffect(() => {
    getList()
  }, [])

  return (
    <code>
      {list.split(`\n`).map((line, i) => (
        <div key={i}>
          {line.split(" ").slice(1).join(" ")}
        </div>
      ))}
    </code>
  )
}
