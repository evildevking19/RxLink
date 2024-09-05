import { useSelector } from 'react-redux';

// project import
import PageTitle from 'components/PageTitle';
import List from './List';
import Form from './Form';
import './prescription.css';

const Prescription = ({ noTitle }) => {
  const { editMode } = useSelector((state) => state.prescription);
  return (
    <>
      {!noTitle && <PageTitle title="Prescription Management" subTitle={!editMode ? 'List' : 'Edit'} F />}
      <List hidden={editMode} />
      {editMode && <Form />}
    </>
  );
};

export default Prescription;
