
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import ModerationActions from './ModerationActions';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

type ClaimRequest = {
  id: string;
  full_name: string;
  job_title: string;
  company_email: string;
  created_at: string;
  status: string;
  company: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    email: string;
    full_name: string;
  };
};

const ClaimRequestsTable = () => {
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  const fetchClaims = async (page: number) => {
    setLoading(true);
    try {
      // Get total count for pagination
      const { count } = await supabase
        .from('claims')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      setTotalPages(Math.ceil((count || 0) / pageSize));

      // Fetch the claims with company and user data
      const { data, error } = await supabase
        .from('claims')
        .select(`
          id,
          full_name,
          job_title,
          company_email,
          created_at,
          status,
          company:companies(id, name),
          user:users(id, email, full_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) {
        throw error;
      }

      setClaims(data as unknown as ClaimRequest[]);
    } catch (error) {
      console.error('Error fetching claims:', error);
      toast.error('Failed to load claim requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleActionComplete = () => {
    fetchClaims(currentPage);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Claim Requests</h3>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : claims.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-md">
          <p className="text-gray-600 dark:text-gray-400">No pending claim requests found.</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">{claim.company?.name || 'Unknown'}</TableCell>
                    <TableCell>{claim.user?.full_name || claim.full_name || 'Unknown'}</TableCell>
                    <TableCell>{claim.job_title}</TableCell>
                    <TableCell>{claim.company_email}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(claim.created_at), { addSuffix: true })}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <ModerationActions 
                          id={claim.id} 
                          type="claim" 
                          companyId={claim.company?.id}
                          userId={claim.user?.id}
                          onActionComplete={handleActionComplete} 
                        />
                        <a 
                          href={`/admin/users/${claim.user?.id}`} 
                          className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
                          title="View User Profile"
                        >
                          🔍
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }} 
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default ClaimRequestsTable;
