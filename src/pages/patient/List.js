import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//  ui import
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// page import //
import { confirmAlert } from 'react-confirm-alert';
import MainTable from 'components/table/MainTable';
import { getList, editPatient, deletePatient } from 'store/reducers/patient';
import { timeString } from 'utils/common';

const columns = [
  { id: 'fullname', title: 'Fullname' },
  { id: 'email', title: 'Email' },
  { id: 'birthday', title: 'DOB' },
  { id: 'phone', title: 'Phone number' },
  { id: 'created', title: 'Created' },
  { title: 'Actions' }
];
const tableOption = {
  columns,
  filters: ['fullname', 'email', 'phone', 'practice'],
  pagination: true,
  limit: 5
};
const List = (props) => {
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  const dataFetch = (data) => {
    dispatch(getList(data));
  };
  const { list, total, saveStatus, deleteStatus } = useSelector((state) => state.patient);

  const editRow = (data) => {
    dispatch(editPatient({ ...data, birthday: data.birthday }));
  };
  const deleteRow = (data) => {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to delete this patient?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => dispatch(deletePatient(data._id))
        },
        {
          label: 'No'
        }
      ]
    });
  };
  useEffect(() => {
    if (saveStatus === 'success' || deleteStatus === 'success') {
      tableRef.current.reloadPage();
    }
  }, [saveStatus, deleteStatus]);
  return (
    <Box sx={{ display: props.hidden ? 'none' : 'block' }}>
      <MainTable
        top={true}
        ref={tableRef}
        fetch={dataFetch}
        data={{ total, list }}
        option={tableOption}
        record={(data) => [
          data.fullname,
          data.email,
          data.birthday,
          data.phone,
          timeString(Number.parseInt(data.created)),
          <>
            <Box sx={{ display: 'flex' }}>
              <Button variant="text" color="secondary" onClick={() => editRow(data)} startIcon={<EditIcon />}>
                Edit
              </Button>
              <Button variant="text" color="secondary" onClick={() => deleteRow(data)} startIcon={<DeleteIcon />}>
                Delete
              </Button>
            </Box>
          </>
        ]}
        actionsComponent={
          <Button onClick={() => dispatch(editPatient())} variant="contained" color="primaryb" startIcon={<AddIcon />}>
            New Patient
          </Button>
        }
      />
    </Box>
  );
};

export default List;
