import Link from 'next/link'
 
export default function Layout({
  modal,
  children,
}: {
  modal: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      {modal}
      {children}
    </>
  )
}
