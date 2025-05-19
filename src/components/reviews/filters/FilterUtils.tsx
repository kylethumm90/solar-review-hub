
import { FilterState, SimpleCompany } from '../types';
import { formatVendorType } from '../reviewUtils';

export interface ActiveFilter {
  type: string;
  value: string;
  label: string;
}

export const getActiveFilters = (filters: FilterState, companies: SimpleCompany[]): ActiveFilter[] => {
  const active: ActiveFilter[] = [];
    
  // Vendor types
  filters.vendorTypes.forEach(type => {
    active.push({
      type: 'vendorType',
      value: type,
      label: formatVendorType(type)
    });
  });
  
  // Grades
  filters.grades.forEach(grade => {
    active.push({
      type: 'grade',
      value: grade,
      label: `Grade: ${grade}`
    });
  });
  
  // States
  filters.states.forEach(state => {
    active.push({
      type: 'state',
      value: state,
      label: `State: ${state}`
    });
  });
  
  // Date filter
  if (filters.reviewDate) {
    let dateLabel = '';
    switch(filters.reviewDate) {
      case '30days': dateLabel = 'Last 30 Days'; break;
      case '90days': dateLabel = 'Last 90 Days'; break;
      case '365days': dateLabel = 'Last Year'; break;
    }
    active.push({
      type: 'reviewDate',
      value: filters.reviewDate,
      label: dateLabel
    });
  }
  
  // Company
  if (filters.companyName) {
    const company = companies.find(c => c.id === filters.companyName);
    if (company) {
      active.push({
        type: 'company',
        value: filters.companyName,
        label: `Company: ${company.name}`
      });
    }
  }
  
  // Still active
  if (filters.stillActive) {
    active.push({
      type: 'stillActive',
      value: filters.stillActive,
      label: `${filters.stillActive === 'yes' ? 'Still Active' : 'Not Active'}`
    });
  }
  
  return active;
};
