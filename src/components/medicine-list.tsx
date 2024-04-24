import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import { IconButton } from "./icon-button";
import dayjs from "dayjs";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ApiSercive, Medicine } from "../api/ApiService";
import { TableRow } from "./table/table-row";
import { TableCell } from "./table/table-cell";
import { TableHeader } from "./table/table-header";
import { Table } from "./table/table";
import * as Dialog from "@radix-ui/react-dialog"
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'
import { DialogSpan } from "./table/dialog-span";



dayjs.extend(relativeTime)
dayjs.locale('pt-br')



export function MedicineList(){
const [search, setSearch] = useState('')
const [page, setPage] = useState(1)
const [isOpen, setIsOpen] = useState(false)
const [medicines, setMedicines] = useState<Medicine[]>([])


const totalPages = Math.ceil(medicines.length/10)

useEffect(()=>{
  
  ApiSercive.getAll().then((data)=>{
    setMedicines(data)
  })
},[search])

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>){

    setSearch(event.target.value)
    setPage(1)
}
  function toggleModal(){
    setIsOpen(!isOpen)
  }
  function goToNextPage(){
    setPage(page + 1)
  }
    function goToPreviousPage(){
    setPage(page - 1)
  }
  function goToFirstPage(){
    setPage(1)
  }
  function goToLastPage(){
    setPage(totalPages)
  }
 const Sortedmedicines = medicines.sort( (a, b )=> {
    const d1 = new Date(a.published_at).getTime()
    const d2 = new Date(b.published_at).getTime()
    if(d1 > d2) return 1
    return -1
 })
 const filteredMedicines = useMemo(() =>{
  return Sortedmedicines.filter(sortedmed => {
    return sortedmed.name.toLowerCase().includes(search.toLowerCase()) || sortedmed.company.toLowerCase().includes(search.toLowerCase())
  })
 }, [search, Sortedmedicines ] )

  return(
    <div className="flex flex-col gap-4">
      <div className="px-3 flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Remédios</h1>
        <div className="flex items-center gap-3 w-72 px-3 py-1.5 border text-sm rounded-lg border-emerald-500/30 bg-transparent">
        <Search className="size-4 text-emerald-300"/>
        <input
          className="bg-transparent focus:ring-0 flex-1 outline-none border-0 p-0 text-sm"
            placeholder="Buscar remédio..."
            value={search}
            onChange={onSearchInputChanged}/>      
        </div>
      </div>
        <Table >  
          <thead>
            <tr className="border-b border-emerald-500/40">
              <TableHeader  style={{width : 48}}>
              </TableHeader >
              <TableHeader >Nome</TableHeader >
              <TableHeader >Laboratório</TableHeader >
              <TableHeader >Data de publicação</TableHeader >
              <TableHeader >Dados do medicamento</TableHeader >
              <TableHeader  style={{width : 64}}></TableHeader >
            </tr>
          </thead>
          <tbody>
             
           {filteredMedicines.slice((page - 1)* 10, (page * 10)).map((medicine)=>{
            return (
               <TableRow key={medicine.id}>
              <TableCell>
               
              </TableCell>
              <TableCell >{medicine.name}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span> {medicine.company}</span>
                </div>
              </TableCell>
              <TableCell><span>{dayjs(medicine.published_at).format('DD/MM/YYYY')}</span></TableCell>
              <TableCell className="py-3 px-4 text-right text-sm font-semibold" colSpan={3}>
                
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <IconButton onClick={toggleModal}>
                    {isOpen ? (<ChevronUp />) : (<ChevronDown />)}
                    </IconButton>
                    </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.DialogOverlay className="fixed w-full h-full inset-0 bg-black/10"/>
                        <Dialog.Content className="min-w-8 fixed border border-white/10 rounded-md p-1.5 bg-zinc-50 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                        <Dialog.Title className="px-16 rounded-md bg-emerald-500 text-white">Dados do Medicamento</Dialog.Title>
                          <div className="mt-0.5 flex flex-col gap-1 max-h-72">
                            <DialogSpan>Tipo: {medicine.documents[0]?.type}</DialogSpan>
                            <DialogSpan>Expediente: {medicine.documents[0]?.expedient}</DialogSpan>
                            <DialogSpan>URl: {medicine.documents[0]?.url}</DialogSpan>
                            <DialogSpan>Princípio ativo: {medicine.active_principles[0]?.name}
                            </DialogSpan>
                           
                            <button className="bg-emerald-500 text-white rounded-md mt-1.5">Baixar Bula</button>
                          </div>
                        <Dialog.Close/>           
                      </Dialog.Content>    
                    </Dialog.Portal> 
                </Dialog.Root>
              </TableCell>
            </TableRow>
            )
           })}
          </tbody>
          
          <tfoot>
            <tr>
              <td 
               className="py-3 px-12 text-left text-sm font-semibold"
               colSpan={3}>
                10  de {medicines.length} itens</td>
              <td 
              className="py-3 px-4 text-right text-sm font-semibold" colSpan={3}>
                <div className="inline-flex items-center gap-8">
                  <span>Página {page} de { totalPages }</span> 
                
                  <div className="flex gap-1.5">
                  <IconButton disabled={page === 1} onClick={goToFirstPage}> 
                    <ChevronsLeft className="size-4"/>
                  </IconButton>
                  <IconButton disabled={page === 1} onClick={goToPreviousPage}> 
                    <ChevronLeft className="size-4"/>
                  </IconButton>
                  <IconButton disabled={page === totalPages } onClick={goToNextPage} > 
                    <ChevronRight className="size-4"/>
                  </IconButton>
                  <IconButton onClick={goToLastPage} disabled={page === totalPages }> 
                    <ChevronsRight className="size-4"/>
                  </IconButton>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </Table>
    </div>
  )  
}