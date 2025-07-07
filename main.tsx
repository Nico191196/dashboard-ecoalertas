import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTable, usePagination } from 'react-table';
import { io, Socket } from 'socket.io-client';
import { MapPin, Calendar, Eye, CheckCircle, Clock, AlertTriangle, Filter, Search, Download, RefreshCw, Sun, Moon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import * as FileSaver from 'file-saver';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

// i18n initialization
i18n.use(initReactI18next).init({
  resources: {
    'es-AR': { translation: {} },
    'en-US': { translation: {} }
  },
  lng: 'es-AR',
  fallbackLng: 'es-AR',
});

type Report = {
  id: number;
  lat: number;
  lng: number;
  category: string;
  photo: string;
  date: string;
  description: string;
  status: string;
};

export default function EcoAlertasDashboard() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [darkMode, setDarkMode] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Fetch reports from API
  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch('/api/reportes');
        const data: Report[] = await res.json();
        setReports(data);
      } catch (e) {
        console.error(e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReports();
  }, []);

  // WebSocket for real-time updates
  useEffect(() => {
    const socketIo = io('/');
    socketIo.on('nuevo-reporte', (newReport: Report) => {
      setReports(prev => [newReport, ...prev]);
      toast.success(t('New report received'));
    });
    setSocket(socketIo);
    return () => { socketIo.disconnect(); };
  }, [t]);

  // Filtered & searched data
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const inCategory = filterCategory.length === 0 || filterCategory.includes(r.category);
      const inStatus = filterStatus.length === 0 || filterStatus.includes(r.status);
      const inSearch = r.description.toLowerCase().includes(searchTerm.toLowerCase()) || r.category.toLowerCase().includes(searchTerm.toLowerCase());
      const inDate = (!startDate || new Date(r.date) >= startDate) && (!endDate || new Date(r.date) <= endDate);
      return inCategory && inStatus && inSearch && inDate;
    });
  }, [reports, filterCategory, filterStatus, searchTerm, startDate, endDate]);

  // Table setup
  const columns = useMemo(() => [
    { Header: t('ID'), accessor: 'id' },
    { Header: t('Category'), accessor: 'category' },
    { Header: t('Status'), accessor: 'status' },
    { Header: t('Date'), accessor: 'date' },
  ], [t]);
  const tableInstance = useTable({ columns, data: filteredReports }, usePagination);

  // Export CSV
  const exportCSV = useCallback(() => {
    const header = columns.map(c => c.Header).join(',');
    const rows = filteredReports.map(r => [r.id, r.category, r.status, r.date].join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, 'reportes.csv');
  }, [columns, filteredReports]);

  if (isLoading) return <div className="p-6">{t('Loading...')}</div>;
  if (isError) return <div className="p-6 text-red-600">{t('Error fetching data')}</div>;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Toaster />
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">EcoAlertas</h1>
        <button onClick={() => setDarkMode(dm => !dm)} className="p-2">
          {darkMode ? <Sun /> : <Moon />}
        </button>
      </header>
      <nav className="p-4 bg-white dark:bg-gray-700">
        {/* filtros: categorías, estados, fecha, búsqueda */}
        <div className="flex flex-wrap gap-4 items-center">
          <Search />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t('Search...')} className="border rounded px-2 py-1" />
          <DatePicker selectsRange startDate={startDate} endDate={endDate} onChange={(update) => setDateRange(update as [Date, Date])} placeholderText={t('Select date range')} />
          <Filter />
          {/* Aquí agregar multiselect para categoría y estado */}
          <button onClick={exportCSV} className="px-3 py-1 bg-blue-600 text-white rounded">{t('Export CSV')}</button>
        </div>
      </nav>

      <main className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPIs */}

        {/* Gráficos y mapa (lazy-loaded) */}
        <Suspense fallback={<div>{t('Loading charts...')}</div>}>
          {/* Charts and MapContainer as before */}
        </Suspense>

        {/* Tabla con paginación */}
        <div className="col-span-full bg-white dark:bg-gray-800 p-4 rounded shadow">
          <table {...tableInstance.getTableProps()} className="min-w-full">
            <thead>
              {tableInstance.headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...tableInstance.getTableBodyProps()}>
              {tableInstance.page.map(row => {
                tableInstance.prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Paginación */}
          <div className="mt-2 flex justify-between">
            <button onClick={() => tableInstance.previousPage()} disabled={!tableInstance.canPreviousPage}>{t('Previous')}</button>
            <span>{t('Page')} {tableInstance.state.pageIndex + 1} {t('of')} {tableInstance.pageOptions.length}</span>
            <button onClick={() => tableInstance.nextPage()} disabled={!tableInstance.canNextPage}>{t('Next')}</button>
          </div>
        </div>
      </main>
    </div>
  );
}
