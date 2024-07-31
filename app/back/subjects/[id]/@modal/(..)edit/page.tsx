import EditSubject from '../../edit/page';

export default function EditModalPage({ params }: { params: { id: string } }) {
    return <EditSubject params={params}/>;
  }