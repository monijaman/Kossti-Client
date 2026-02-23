// app/admin/brands/[id]/page.tsx

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const { id } = await params
    return <div>My Post: {id}</div>
  }


// export default function Page({ params }: { params: { id: string } }) {
//   return <SpecificationPage params={{ id: parseInt(params.id) }} />;
// }
