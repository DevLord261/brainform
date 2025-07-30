export function TextResponsesList({ data }: { data: string[] }) {
  return (
    <div className="w-full h-full max-h-[250px] overflow-y-auto rounded-md border p-3 space-y-2 bg-muted/50">
      {data.map((response, index) => (
        <p key={index} className="text-sm p-2 bg-background rounded-md shadow-sm truncate">
          {response}
        </p>
      ))}
    </div>
  )
}
