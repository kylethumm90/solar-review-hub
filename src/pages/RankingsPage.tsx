
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import RankingsTable from "@/components/rankings/RankingsTable";
import { RankingsService } from "@/services/RankingsService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function RankingsPage() {
  const [loading, setLoading] = useState(true);
  const [rankings, setRankings] = useState<any[]>([]);
  const [sortOption, setSortOption] = useState("grade");
  const [vendorTypeFilter, setVendorTypeFilter] = useState<string | null>(null);
  const [gradeFilter, setGradeFilter] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [vendorTypes, setVendorTypes] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const types = await RankingsService.getUniqueVendorTypes();
        setVendorTypes(types);
        
        // Get available grades A+ to F
        const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
        setGrades(gradeOptions);
        
        // Get regions from the operating_states across companies
        const availableRegions = await RankingsService.getOperatingRegions();
        setRegions(availableRegions);
      } catch (error) {
        console.error("Error loading filter options:", error);
      }
    }
    
    loadFilterOptions();
  }, []);

  useEffect(() => {
    async function fetchRankings() {
      setLoading(true);
      try {
        const data = await RankingsService.getRankings(
          sortOption,
          vendorTypeFilter,
          gradeFilter,
          regionFilter
        );
        setRankings(data);
      } catch (error) {
        console.error("Error fetching rankings:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRankings();
  }, [sortOption, vendorTypeFilter, gradeFilter, regionFilter]);

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const formatVendorType = (type: string): string => {
    if (!type) return "";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <Helmet>
        <title>SolarGrade Power Rankings</title>
      </Helmet>
      
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
                  <Trophy className="h-7 w-7 text-yellow-500" />
                  SolarGrade Power Rankings
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Real-time rankings of verified vendors based on review quality, consistency, and coverage.
                </CardDescription>
              </div>
              
              <div className="flex-shrink-0">
                <Select
                  value={sortOption}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grade">Highest Grade</SelectItem>
                    <SelectItem value="reviews">Most Verified Reviews</SelectItem>
                    <SelectItem value="installs">Most Installs</SelectItem>
                    <SelectItem value="recent">Recent Activity</SelectItem>
                    <SelectItem value="alpha">Alphabetical (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {/* Optional Filters */}
              <Select
                value={vendorTypeFilter || ""}
                onValueChange={(value) => setVendorTypeFilter(value === "" ? null : value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Vendor Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {vendorTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatVendorType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={gradeFilter || ""}
                onValueChange={(value) => setGradeFilter(value === "" ? null : value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Grades</SelectItem>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={regionFilter || ""}
                onValueChange={(value) => setRegionFilter(value === "" ? null : value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Regions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex justify-center my-12">
                <LoadingSpinner message="Loading rankings..." />
              </div>
            ) : (
              <RankingsTable rankings={rankings} sortOption={sortOption} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
