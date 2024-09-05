import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { InputBase } from '@mui/material';
import { SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const StyledTableCell = styled(TableCell)(() => ({
  '& .MuiButtonBase-root+.MuiButtonBase-root': {
    marginLeft: '10px'
  },
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f5f5f5'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '6px 12px'
  }
}));

const StyledTableRow = styled(TableRow)(() => ({
  borderBottom: '10px solid #f5f5f5',
  backgroundColor: 'white'
  // '&:nth-of-type(odd)': {
  //   backgroundColor: theme.palette.action.hover
  // },
  // // hide last border
  // '&:last-child td, &:last-child th': {
  //   border: 0
  // }
}));

const MainTable = forwardRef((props, ref) => {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const theme = useTheme();
  const { option, data, fetch, actionsComponent, record, top } = props;
  const { total, list } = data;
  const { filters: filterOption, columns, pagination, limit } = option;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const count = limit ?? 0;
  const filters = filterOption ?? [];
  const reloadPage = () => {
    fetch({ page, count, search, filters });
  };

  const handleSearch = (e) => {
    if (e.keyCode == 13) {
      fetch({ page: 1, count, search, filters });
      setPage(1);
    }
  };

  const handlePageChange = (_, value) => {
    fetch({ page: value, count, search, filters });
    setPage(value);
  };

  useEffect(() => {
    fetch({ page, count, search, filters });
  }, []);

  useImperativeHandle(ref, () => ({
    reloadPage
  }));

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          gap: 2,
          [theme.breakpoints.up('xs')]: {
            flexDirection: 'column'
          },
          [theme.breakpoints.up('sm')]: {
            flexDirection: 'row'
          }
        }}
      >
        {(filters.length != 0 || actionsComponent) && (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'end', marginTop: top ? (!matchDownSM ? '-30px' : 0) : 0 }}>
            {filters.length != 0 && (
              <Box
                sx={{
                  display: 'flex',
                  border: '1px solid #ccc',
                  p: '5px 10px',
                  maxWidth: '300px',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <SearchOutlined style={{ fontSize: '24px', color: '#aaa' }} />
                <InputBase
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search..."
                />
              </Box>
            )}
            {actionsComponent}
          </Box>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {columns?.map((column) => (
                <StyledTableCell key={'col-head' + column.id}>{column.title}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {list?.map((row, index) => (
              <StyledTableRow key={'data-row' + index}>
                {record &&
                  columns.map((column, index) => <StyledTableCell key={row._id + '/' + column.id}>{record(row)[index]}</StyledTableCell>)}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
        {pagination && (
          <Stack spacing={2}>
            <Pagination
              count={count !== 0 ? Math.ceil(total / count) : 0}
              color="primaryb"
              page={page}
              onChange={handlePageChange}
              showFirstButton
              showLastButton
              shape="rounded"
            />
          </Stack>
        )}
      </Box>
    </>
  );
});
MainTable.propTypes = {
  option: PropTypes.shape({
    filters: PropTypes.array,
    columns: PropTypes.array.isRequired,
    pagination: PropTypes.bool,
    limit: PropTypes.number
  }).isRequired,
  data: PropTypes.shape({
    total: PropTypes.number.isRequired,
    list: PropTypes.array.isRequired
  }).isRequired,
  fetch: PropTypes.func.isRequired,
  actionsComponent: PropTypes.element.isRequired,
  record: PropTypes.func.isRequired
};

export default MainTable;
