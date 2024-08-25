import EditTutor from '../../edit/page';
import EditStudent from '../../edit/page';

export default function EditModalPage({ params }: { params: { id: string } }) {
    return <EditTutor params={params}/>;
  }