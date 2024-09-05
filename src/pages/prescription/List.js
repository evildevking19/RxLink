import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// mui import
import { Button, Box, Stack } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import RestorePageRoundedIcon from '@mui/icons-material/RestorePageRounded';
import Typography from '@mui/material/Typography';
// third party
import { confirmAlert } from 'react-confirm-alert';
// page import //
import MainTable from 'components/table/MainTable';
import { getList, editPrescription, deletePrescription, sendPrescription, regeneratePdfs } from 'store/reducers/prescription';
import { getCreditInformation } from 'store/reducers/credit';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { datetime } from 'utils/common';

// import iconCalendar from 'assets/images/dashboard/calendar.png';
// import iconClock from 'assets/images/dashboard/clock.png';

import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';

const columns = [
  { id: 'rid', title: 'Prescription ID' },
  { id: 'patient', title: 'Patient' },
  { id: 'pharmacy', title: 'Pharmacy' },
  { id: 'created', title: 'Created' },
  { id: 'status', title: 'Send' },
  { id: 'dispense', title: 'Dispensed' },
  { title: 'Actions' }
];
const tableOption = {
  columns,
  filters: ['rid', 'patient.fullname', 'pharmacy.trading_name', 'pharmacy.post_code'],
  pagination: true,
  limit: 5
};
const List = (props) => {
  const tableRef = useRef(null);
  const dispatch = useDispatch();
  const { list, total, saveStatus, deleteStatus } = useSelector((state) => state.prescription);

  const sendRow = (data) => {
    dispatch(sendPrescription(data._id))
      .then(() => {
        dispatch(getCreditInformation());
    });
  };
  const editRow = (data) => {
    let editData = { ...data };
    if (editData) {
      editData.patient = { ...editData.patient, label: editData.patient.fullname + ', ' + editData.patient.email };
      if (editData.pharmacy)
        editData.pharmacy = { ...editData.pharmacy, label: editData.pharmacy.trading_name + ', ' + editData.pharmacy.post_code };
    }
    dispatch(editPrescription(editData));
  };
  const deleteRow = (data) => {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to delete this prescription?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => dispatch(deletePrescription(data._id))
        },
        {
          label: 'No'
        }
      ]
    });
  };
  const dataFetch = (data) => {
    dispatch(getList(data));
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
        title="Prescription Management"
        subTitle="List"
        dataFetch={dataFetch}
        ref={tableRef}
        fetch={dataFetch}
        data={{ total, list }}
        option={tableOption}
        record={(data) => {
          const [date, time] = datetime(Number.parseInt(data.created));
          const timeComponent = (
            <Stack direction="row" spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonthOutlinedIcon />
                <span>{date}</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <QueryBuilderIcon />
                <span>{time}</span>
              </Box>
            </Stack>
          );
          return [
            data.rid,
            data.patient.fullname,
            data.pharmacy ? `${data.pharmacy.trading_name} (${data.pharmacy.post_code})` : 'All',
            timeComponent,
            data.status ? (
              <Typography color="#41B700" size="small">
                Successful
              </Typography>
            ) : (
              <Typography color="#FF9900" size="small">
                Pending
              </Typography>
            ),
            data.dispense ? (
              <Typography color="#41B700" size="small">
                Successful
              </Typography>
            ) : (
              <Typography color="#FF9900" size="small">
                Pending
              </Typography>
            ),
            <>
              <Box sx={{ display: 'flex' }}>
                <LoadingButton
                  loading={data.sending}
                  variant="text"
                  color="secondary"
                  disabled={data.dispense}
                  onClick={() => sendRow(data)}
                  startIcon={<SendIcon />}
                >
                  {data.status ? 'Resend' : 'Send'}
                </LoadingButton>
                <Button variant="text" color="secondary" disabled={data.dispense} onClick={() => editRow(data)} startIcon={<EditIcon />}>
                  Edit
                </Button>
                <LoadingButton
                  loading={data.deleting}
                  variant="text"
                  color="secondary"
                  disabled={data.dispense}
                  onClick={() => deleteRow(data)}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </LoadingButton>
              </Box>
            </>
          ];
        }}
        actionsComponent={
          <>
            <Button onClick={() => dispatch(editPrescription())} variant="contained" color="primaryb" startIcon={<AddIcon />}>
              New Prescription
            </Button>
          </>
        }
      />
    </Box>
  );
};

export default List;
