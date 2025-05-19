
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EpcMetadataFieldsProps {
  installCount: number | null;
  setInstallCount: React.Dispatch<React.SetStateAction<number | null>>;
  stillActive: string | null;
  setStillActive: React.Dispatch<React.SetStateAction<string | null>>;
  lastInstallDate: string | null;
  setLastInstallDate: React.Dispatch<React.SetStateAction<string | null>>;
  installStates: string[];
  setInstallStates: React.Dispatch<React.SetStateAction<string[]>>;
  recommendEpc: string | null;
  setRecommendEpc: React.Dispatch<React.SetStateAction<string | null>>;
}

// Define US states constants
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

const EpcMetadataFields: React.FC<EpcMetadataFieldsProps> = ({
  installCount,
  setInstallCount,
  stillActive,
  setStillActive,
  lastInstallDate,
  setLastInstallDate,
  installStates,
  setInstallStates,
  recommendEpc,
  setRecommendEpc,
}) => {
  const handleStateChange = (state: string) => {
    setInstallStates(prev => {
      if (prev.includes(state)) {
        return prev.filter(s => s !== state);
      } else {
        return [...prev, state];
      }
    });
  };

  return (
    <div className="space-y-8 border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
      <h3 className="text-lg font-semibold">Additional Information</h3>
      
      {/* Field 1: Number of Installs */}
      <div>
        <Label htmlFor="install-count" className="block font-semibold mb-2">
          Approximately how many installs have you completed with this EPC?
        </Label>
        <Input
          id="install-count"
          type="number"
          min={1}
          max={1000}
          step={1}
          placeholder="Enter a number (estimates are fine)"
          onChange={(e) => setInstallCount(Number(e.target.value) || null)}
          className="mb-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Estimates are fine. Just give your best approximation.
        </p>

        <p className="mt-4 text-sm text-gray-600 font-medium">Not sure? Pick a range:</p>
        <Select onValueChange={(value) => setInstallCount(Number(value) || null)}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select a range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="3">2-5</SelectItem>
            <SelectItem value="8">6-10</SelectItem>
            <SelectItem value="18">11-25</SelectItem>
            <SelectItem value="38">26-50</SelectItem>
            <SelectItem value="75">51-100</SelectItem>
            <SelectItem value="100">100+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Field 2: Still Working With This EPC? */}
      <div>
        <Label className="block font-semibold mb-2">
          Are you still working with this EPC?
        </Label>
        <RadioGroup value={stillActive || undefined} onValueChange={setStillActive}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="still-active-yes" />
              <Label htmlFor="still-active-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="still-active-no" />
              <Label htmlFor="still-active-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="considering" id="still-active-considering" />
              <Label htmlFor="still-active-considering">Considering ending the relationship</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Field 3: Most Recent Install Date */}
      <div>
        <Label htmlFor="last-install-date" className="block font-semibold mb-2">
          When was your most recent install with this EPC?
        </Label>
        <Input
          id="last-install-date"
          type="month"
          value={lastInstallDate || ''}
          max={new Date().toISOString().split('T')[0].slice(0, 7)}
          onChange={(e) => setLastInstallDate(e.target.value || null)}
        />
      </div>

      {/* Field 4: Install Locations */}
      <div>
        <Label className="block font-semibold mb-2">
          Where were most of your installs with this EPC located?
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto border rounded-md p-2">
          {US_STATES.map((state) => (
            <div key={state.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`state-${state.value}`} 
                checked={installStates.includes(state.value)}
                onCheckedChange={() => handleStateChange(state.value)}
              />
              <Label htmlFor={`state-${state.value}`} className="text-sm">
                {state.label}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          You may select more than one state.
        </p>
      </div>

      {/* Field 5: Recommend This EPC */}
      <div>
        <Label className="block font-semibold mb-2">
          Would you recommend this EPC to another organization?
        </Label>
        <RadioGroup value={recommendEpc || undefined} onValueChange={setRecommendEpc}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="recommend-yes" />
              <Label htmlFor="recommend-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="recommend-no" />
              <Label htmlFor="recommend-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unsure" id="recommend-unsure" />
              <Label htmlFor="recommend-unsure">Not sure</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default EpcMetadataFields;
