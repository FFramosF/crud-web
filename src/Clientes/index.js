import React, { Component } from 'react';
import './styles.css';
import { Button, DialogContent, Grid, IconButton, DialogActions } from '@mui/material';
import * as ClientesAction from '../Api/Clientes/actions';
import { connect } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { red, green, grey } from '@mui/material/colors';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import Snackbar from '@mui/material/Snackbar';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import jsPDF from "jspdf";
import "jspdf-autotable";

class Clientes extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalAgregar: false,
            nombreAdd: '',
            apeMatAdd: '',
            apePatAdd: '',
            domicilioAdd: '',
            rfcAdd: '',
            curpAdd: '',
            fechaNacAdd: dayjs('01-01-2000'),
            openSnackbar: false,
            messageSnackbar:  '',
            modalEliminar: false,
            preClienteDeleted: '',

            modalModificar: false,
            idMod: '',
            nombreMod: '',
            apeMatMod: '',
            apePatMod: '',
            domicilioMod: '',
            rfcMod: '',
            curpMod: '',
            fechaNacMod: dayjs('01-01-2000'),
        }
    }

    componentDidMount() {
        this.props.getClientes();
    }

    handleClickOpenAddModal =() => {
        this.setState({
            modalAgregar: true
        })
    }

    handleCloseModalAgregar =() => {
        this.setState({
            modalAgregar: false,
        })
    }

    handleCloseModalEliminar =() => {
        this.setState({
            modalEliminar: false,
        })
    }

    handleOpenModalEliminar =(row) => {
        this.setState({
            modalEliminar: true,
            preClienteDeleted: row.id
        })
    }

    onChangeNombreAdd =(e)=> {
        //regex para prevenir caracteres especiales
        let prevariable = /^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g;
        let varrr = e.target.value.replace(prevariable, '')
        console.log(varrr);
        if (e.target.id === 'nombresAdd') {
            this.setState({
                nombreAdd: prevariable
            });
        } else if (e.target.id === 'apeMatAdd') {
            this.setState({
                apeMatAdd: prevariable
            });
        } else if (e.target.id === 'apePatAdd') {
            this.setState({
                apePatAdd: prevariable
            })
        } else if (e.target.id === 'curpAdd') {
            this.setState({
                curpAdd: prevariable
            })
        } else if (e.target.id === 'rfcAdd') {
            this.setState({
                rfcAdd: prevariable
            })
        } else if (e.target.id === 'domicilioAdd') {
            this.setState({
                domicilioAdd: prevariable
            })
        }
    }

    handleSaveModalAggregar = async () => {

        const body = {
            nombres: this.state.nombreAdd,
            apellidoPaterno: this.state.apePatAdd,
            apellidoMaterno: this.state.apeMatAdd,
            domicilio: this.state.domicilioAdd,
            fechaNacimiento: `${this.state.fechaNacAdd.date()}-${this.state.fechaNacAdd.month()+1}-${this.state.fechaNacAdd.year()}`,
            rfc: this.state.rfcAdd,
            curp: this.state.curpAdd,
        }

        const actionGuardarCliente = await this.props.addCliente(body);

        if (actionGuardarCliente.error) {
            this.setState({
                openSnackbar: true,
                messageSnackbar: actionGuardarCliente.message
            });
        } else {
            this.props.getClientes();
            this.setState({
                openSnackbar: true,
                messageSnackbar: actionGuardarCliente.message,
                modalAgregar: false,
                nombreAdd: '',
                apeMatAdd: '',
                apePatAdd: '',
                domicilioAdd: '',
                rfcAdd: '',
                curpAdd: '',
                fechaNacAdd: dayjs('01-01-2000'),
            })
        }
    }

    handleDeleteCliente = async () => {
        const deleted = await this.props.deleteCliente(this.state.preClienteDeleted);
        
        if (deleted.error) {
            this.setState({
                openSnackbar: true,
                messageSnackbar: deleted.message
            });
        } else {
            this.props.getClientes();
            this.setState({
                openSnackbar: true,
                messageSnackbar: deleted.message,
                modalEliminar: false,
                preClienteDeleted: '',
            })
        }
    }

    handleCloseSnackbar = () => {
        this.setState({
            openSnackbar: false
        })
    }

    handleOpenModificarClienteModal = (row) => {
        this.setState({
            idMod: row.id,
            nombreMod: row.nombres,
            apeMatMod: row.apellidoMaterno,
            apePatMod: row.apellidoPaterno,
            domicilioMod: row.domicilio,
            rfcMod: row.rfc,
            curpMod: row.curp,
            fechaNacMod: dayjs(row.fechaNacimiento),
            modalModificar: true
        });
    }

    handleCloseModalModificar =() => {
        this.setState({
            modalModificar: false,
        })
    }

    onChangeTexTMod =(e)=> {
        if (e.target.id === 'nombresMod') {
            this.setState({
                nombreMod: e.target.value
            });
        } else if (e.target.id === 'apeMatMod') {
            this.setState({
                apeMatMod: e.target.value
            });
        } else if (e.target.id === 'apePatMod') {
            this.setState({
                apePatMod: e.target.value
            })
        } else if (e.target.id === 'curpMod') {
            this.setState({
                curpMod: e.target.value
            })
        } else if (e.target.id === 'rfcMod') {
            this.setState({
                rfcMod: e.target.value
            })
        } else if (e.target.id === 'domicilioMod') {
            this.setState({
                domicilioMod: e.target.value
            })
        }
    }

    handleSaveModalModificar = async () => {

        const body = {
            id: this.state.idMod,
            nombres: this.state.nombreMod,
            apellidoPaterno: this.state.apePatMod,
            apellidoMaterno: this.state.apeMatMod,
            domicilio: this.state.domicilioMod,
            fechaNacimiento: `${this.state.fechaNacMod.date()}-${this.state.fechaNacMod.month()+1}-${this.state.fechaNacMod.year()}`,
            rfc: this.state.rfcMod,
            curp: this.state.curpMod,
        }

        const actionModificarCliente = await this.props.alterCliente(body);

        if (actionModificarCliente.error) {
            this.setState({
                openSnackbar: true,
                messageSnackbar: actionModificarCliente.message
            });
        } else {
            this.props.getClientes();
            this.setState({
                openSnackbar: true,
                messageSnackbar: actionModificarCliente.message,
                modalModificar: false,
                idMod: '',
                nombreMod: '',
                apeMatMod: '',
                apePatMod: '',
                domicilioMod: '',
                rfcMod: '',
                curpMod: '',
                fechaNacMod: dayjs('01-01-2000'),
            })
        }
    }

    downloadClientes =() => {
        const unit = "pt";
        const size = "A4";
        const orientation = "landscape";
    
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
    
        doc.setFontSize(10);
    
        const title = "Reporte de clientes activos";
        const headers = [["Nombre Completo", "Fecha Nacimiento", "curp", "rfc", "Domicilio", "Estatus", "Fecha Registro", "Ult. Modificación"]];
    
        const data = this.props.clientes.clienteList.map(elt=> [`${elt.nombres + ' ' + elt.apellidoPaterno + ' ' + elt.apellidoMaterno}`, elt.fechaNacimiento, elt.curp, elt.rfc, elt.domicilio, elt.status, elt.createdAt, elt.updatedAt]);
    
        let content = {
          startY: 50,
          head: headers,
          body: data
        };
    
        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("clientes.pdf")
    }

    render() {
        const {clientes} = this.props;
        return (
            <div className='partentDiv'>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12}>
                        <div>
                            Administración de clientes
                        </div>
                    </Grid>
                    <Grid xs={12}>
                        <Button variant='outlined' style={{ visibility: 'hidden' }}> Visualizar todos los clientes</Button>
                    </Grid>
                    <Grid  xs={10} >
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">Nombre Completo</TableCell>
                                        <TableCell align="right">Fecha Nacimiento</TableCell>
                                        <TableCell align="right">Curp</TableCell>
                                        <TableCell align="right">RFC</TableCell>
                                        <TableCell align="right">Domicilio</TableCell>
                                        <TableCell align="right">Estatus</TableCell>
                                        <TableCell align="right">Fecha Registro</TableCell>
                                        <TableCell align="right">Fecha Registro</TableCell>
                                        <TableCell align="right"></TableCell>

                                    </TableRow>
                                </TableHead>
                            <TableBody>
                                {clientes && clientes.clienteList && clientes.clienteList.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">{row.nombres + ' ' + row.apellidoPaterno + ' ' + row.apellidoMaterno}</TableCell>
                                        <TableCell align="right">{row.fechaNacimiento}</TableCell>
                                        <TableCell align="right">{row.curp}</TableCell>
                                        <TableCell align="right">{row.rfc}</TableCell>
                                        <TableCell align="right">{row.domicilio || 'No disponible'}</TableCell>
                                        <TableCell align="right">{row.status || 'No disponible'}</TableCell>
                                        <TableCell align="right">{row.createdAt || 'No disponible'}</TableCell>
                                        <TableCell align="right">{row.updatedAt || 'No disponible'}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => this.handleOpenModificarClienteModal(row)}>
                                                <EditIcon color='primary' />
                                            </ IconButton> 
                                            <IconButton onClick={() => this.handleOpenModalEliminar(row)}>
                                                <DeleteIcon sx={{ color: red[500] }} />
                                            </ IconButton> 
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
                <Dialog onClose={this.handleCloseModalAgregar}
                open={this.state.modalAgregar}
                className='dialogAdd'
                >
                    <DialogTitle>
                        Agregar Cliente
                    </DialogTitle>
                    <DialogContent>
                        <Grid container >
                            <Grid xs={4}>
                                <TextField
                                id='nombresAdd'
                                label='Nombres'
                                variant='outlined'
                                className='gridAdd'
                                value={this.state.nombreAdd}
                                onChange={this.onChangeNombreAdd}
                                />
                            </Grid>
                            <Grid xs={4}>
                                <TextField 
                                id='apeMatAdd'
                                label='Apellido Materno'
                                variant='outlined'
                                className='gridAdd'
                                value={this.state.apeMatAdd}
                                onChange={this.onChangeNombreAdd}
                                />
                            </Grid>
                            <Grid xs={4}>
                                <TextField 
                                id='apePatAdd'
                                className='gridAdd'
                                label='Apellido Paterno'
                                variant='outlined'
                                value={this.state.apePatAdd}
                                onChange={this.onChangeNombreAdd}
                                />
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid xs={4}>
                                <TextField
                                id='domicilioAdd'
                                label='Domicilio'
                                variant='outlined'
                                className='gridAdd'
                                value={this.state.domicilioAdd}
                                onChange={this.onChangeNombreAdd}
                                />
                            </Grid>
                            <Grid xs={4}>
                                <TextField 
                                id='rfcAdd'
                                label='RFC'
                                variant='outlined'
                                className='gridAdd'
                                value={this.state.rfcAdd}
                                onChange={this.onChangeNombreAdd}
                                />
                            </Grid>
                            <Grid xs={4} >
                                <TextField 
                                id='curpAdd'
                                label='CURP'
                                variant='outlined'
                                className='gridAdd'
                                value={this.state.curpAdd}
                                onChange={this.onChangeNombreAdd}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid xs={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        className='gridAdd'
                                        label='Fecha Nacimiento'
                                        format='DD-MM-YYYY'
                                        value={this.state.fechaNacAdd}
                                        onChange={(e) => {
                                            this.setState({ fechaNacAdd: e
                                            })
                                        }}
                                     />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseModalAgregar}>Cerrar</Button>
                        <Button onClick={this.handleSaveModalAggregar} >Registrar</Button>
        </DialogActions>
                </Dialog>
                <Snackbar 
                    open={this.state.openSnackbar}
                    message={this.state.messageSnackbar}
                    onClose={this.handleCloseSnackbar}
                    autoHideDuration={6000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    />


<Dialog onClose={this.handleCloseModalAgregar}
                open={this.state.modalEliminar}
                className='dialogAdd'
                >
                    <DialogTitle>
                        ¿Desea eliminar el cliente?
                    </DialogTitle>

                    <DialogActions>
                        <Button onClick={this.handleCloseModalEliminar}>Cerrar</Button>
                        <Button onClick={this.handleDeleteCliente} >Eliminar</Button>
        </DialogActions>
                </Dialog>
                <Fab color="secondary" aria-label="add" sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      bgcolor: green[500],
                      '&:hover': {
                        bgcolor: green[600],
                      },
                }}
                    onClick={this.handleClickOpenAddModal}
                >
                    <AddIcon />
                </Fab>

                <Fab color="secondary" aria-label="add" sx={{
                      position: 'absolute',
                      bottom: 80,
                      right: 16,
                      bgcolor: grey[500],
                      '&:hover': {
                        bgcolor: grey[600],
                      },
                }}
                    onClick={this.downloadClientes}
                >
                    <DownloadIcon />
                </Fab>



                <Dialog onClose={this.handleCloseModalModificar}
                open={this.state.modalModificar}
                className='dialogAdd'
                >
                    <DialogTitle>
                        Modificar Cliente
                    </DialogTitle>
                    <DialogContent>
                        <Grid container >
                            <Grid xs={4}>
                                <TextField
                                id='nombresMod'
                                label='Nombres'
                                variant='outlined'
                                className='gridAdd'
                                value={this.state.nombreMod}
                                onChange={this.onChangeTexTMod}
                                />
                            </Grid>
                            <Grid xs={4}>
                                <TextField 
                                id='apeMatMod'
                                label='Apellido Materno'
                                variant='outlined'
                                className='gridAdd'
                                value={this.state.apeMatMod}
                                onChange={this.onChangeTexTMod}
                                />
                            </Grid>
                            <Grid xs={4}>
                                <TextField 
                                id='apePatMod'
                                className='gridAdd'
                                label='Apellido Paterno'
                                variant='outlined'
                                value={this.state.apePatMod}
                                onChange={this.onChangeTexTMod}
                                />
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid xs={4}>
                                <TextField
                                id='domicilioMod'
                                label='Domicilio'
                                variant='outlined'
                                className='gridAdd'
                                value={this.state.domicilioMod}
                                onChange={this.onChangeTexTMod}
                                />
                            </Grid>
                            <Grid xs={4}>
                                <TextField 
                                id='rfcMod'
                                label='RFC'
                                variant='outlined'
                                className='gridAdd'
                                value={this.state.rfcMod}
                                onChange={this.onChangeTexTMod}
                                />
                            </Grid>
                            <Grid xs={4} >
                                <TextField 
                                id='curpMod'
                                label='CURP'
                                variant='outlined'
                                className='gridAdd'
                                value={this.state.curpMod}
                                onChange={this.onChangeTexTMod}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid xs={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        className='gridMod'
                                        label='Fecha Nacimiento'
                                        format='DD-MM-YYYY'
                                        value={this.state.fechaNacMod}
                                        onChange={(e) => {
                                            this.setState({ fechaNacMod: e
                                            })
                                        }}
                                     />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseModalModificar}>Cerrar</Button>
                        <Button onClick={this.handleSaveModalModificar} > Modificar </Button>
        </DialogActions>
                </Dialog>



            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
      clientes: state.ClientesReducer.allClientes,
      addCliente: state.ClientesReducer.addCliente,
      deleteCliente: state.ClientesReducer.deleteCliente,
      alterCliente: state.ClientesReducer.alterCliente
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      getClientes: () => dispatch(ClientesAction.getAllClientes()),
      addCliente: (body) => dispatch(ClientesAction.addCliente(body)),
      deleteCliente: (id) => dispatch(ClientesAction.deleteCliente(id)),
      alterCliente: (body) => dispatch(ClientesAction.alterCliente(body)),
    }
  }
  

export default connect(mapStateToProps, mapDispatchToProps)(Clientes);