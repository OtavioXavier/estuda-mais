interface propsSection {
  title: string,
  children: React.ReactNode
}

export default function Section({title, children}: propsSection) {
  return (
    <div className="animate-fadeIn flex flex-col items-start mt-8">
    <h1 className="text-xl font-semibold">{title}</h1>
    {children}
  </div>
  )
}