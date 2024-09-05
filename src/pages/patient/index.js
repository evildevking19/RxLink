import { useSelector } from 'react-redux';
// material-ui

// project import
import PageTitle from 'components/PageTitle';
import List from './List';
import Form from './Form';

import './patient.css';

const Patient = ({ noTitle }) => {
  const { editMode } = useSelector((state) => state.patient);
  return (
    <>
      {!noTitle && <PageTitle title="Patient Management" subTitle={!editMode ? 'List' : 'Edit'} />}
      <List hidden={editMode} />
      {editMode && <Form />}
    </>
  );
};

export default Patient;
