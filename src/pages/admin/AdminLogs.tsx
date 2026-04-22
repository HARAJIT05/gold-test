import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Loader2, ClipboardList, Clock } from "lucide-react";

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
      if (data) {
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const formatAction = (action: string) => {
     return action.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-navy-900 mb-8">System Audit Logs</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 uppercase text-xs text-gray-500 font-semibold tracking-wider">
              <th className="p-4">Timestamp</th>
              <th className="p-4">Admin</th>
              <th className="p-4">Action Type</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
               <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-gold-500 mx-auto" /></td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-400">No activity logs found.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                       <Clock className="w-3 h-3" />
                       {new Date(log.created_at).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-navy-900 bg-gray-100 px-2.5 py-1 rounded-md text-xs">{log.admin_email}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-gold-50 text-gold-600 px-2 py-1 rounded">
                      {formatAction(log.action)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                     {log.details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
