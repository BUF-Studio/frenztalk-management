import EditStudent from '../../edit/page';

export default function EditModalPage({ params }: { params: { id: string } }) {
  return <EditStudent params={params} />;
}