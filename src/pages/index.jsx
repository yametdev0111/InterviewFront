import { InputBox } from "@/components";
// import { CheckBox } from "@mui/icons-material";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
  IconButton,
  Box,
  TableFooter,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { createQuestion, lookupQuestion } from "@/actions";

const columns = ["Category", "Question", "Answer"];

const DashboardPage = () => {
  const width = { Category: 100, Question: 200 };
  const prep = { category: "", question: "", answer: "" };
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [value, setValue] = useState(prep);

  const handleReload = () => {
    lookupQuestion(
      {
        from: page * rowsPerPage,
        count: rowsPerPage,
        category: { $regex: value.category, $options: "i" },
        question: { $regex: value.question, $options: "i" },
        answer: { $regex: value.answer, $options: "i" },
      },
      (response) => {
        if (response.result && Array.isArray(response.data)) {
          setRows(response.data);
          setCount(response.count);
        }
      }
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAdd = () => {
    createQuestion({ ...value }, (response) => {
      if (response.result) {
        setValue({ category: value.category, question: "", answer: "" });
        handleReload();
      }
    });
  };

  useEffect(() => {
    handleReload();
  }, [page, rowsPerPage, value]);

  return (
    <Paper sx={{ height: "100%" }}>
      <TableContainer
        sx={{
          maxHeight: "100%",
          position: "relative",
          ".MuiTableCell-root": { p: 1 },
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead
            sx={{
              position: "sticky",
              top: "0px",
              background: "white",
              zIndex: "40",
            }}
          >
            <TableRow>
              <TableCell sx={{ width: "42px" }}>
                <Checkbox />
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  sx={{ maxWidth: width[column], minWidth: width[column] }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={{ verticalAlign: "top" }}>
                <IconButton color="primary" onClick={handleAdd}>
                  <AddIcon />
                </IconButton>
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  sx={{
                    top: "57px !important",
                    verticalAlign: "top",
                    maxWidth: width[column],
                    minWidth: width[column],
                  }}
                >
                  <InputBox
                    multiline
                    value={value[column.toLowerCase()] ?? ""}
                    onChange={(newValue) =>
                      setValue({
                        ...value,
                        [column.toLowerCase()]: newValue,
                      })
                    }
                  ></InputBox>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, ind) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={ind}
                  selected={true}
                  aria-aria-checked={true}
                >
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  {columns.map((column, index) => (
                    <TableCell key={index}>
                      {row[column.toLowerCase()]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  No data available.
                </TableCell>
              </TableRow>
            )}
            <TableRow
              sx={{
                position: "sticky",
                bottom: "0px",
                left: "0px",
                right: "0px",
                background: "white",
              }}
            >
              <TableCell colSpan={6}>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={count}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DashboardPage;
