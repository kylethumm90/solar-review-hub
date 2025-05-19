
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star } from 'lucide-react';
import { scoreToGrade } from '@/utils/reviewUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ReviewQuestion } from '@/types';

interface AnswerWithCategory {
  category: string;
  rating: number;
  question: ReviewQuestion;
}

const ReviewConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<AnswerWithCategory[]>([]);
  const [vendorName, setVendorName] = useState<string>('');
  const [overallGrade, setOverallGrade] = useState<string>('');
  
  useEffect(() => {
    // Retrieve data from location state
    const state = location.state as { 
      answers?: Record<string, { rating: number; question: ReviewQuestion }>;
      vendorName?: string;
      averageScore?: number;
      vendorId?: string;
    } | null;
    
    if (!state?.answers) {
      // No data found, redirect back to vendors
      navigate('/vendors');
      return;
    }
    
    // Format answers for display
    const formattedAnswers = Object.values(state.answers).map(({ rating, question }) => ({
      category: question.category,
      rating,
      question
    }));
    
    setAnswers(formattedAnswers);
    setVendorName(state.vendorName || 'the vendor');
    
    // Calculate overall grade if provided
    if (state.averageScore) {
      setOverallGrade(scoreToGrade(state.averageScore));
    }
  }, [location, navigate]);
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  const getBadgeColor = (grade: string) => {
    if (grade.startsWith('A')) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (grade.startsWith('B')) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };
  
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Thanks for your review!</h2>
        <p className="mb-6">
          Based on your ratings, SolarGrade has translated your feedback into the following performance grades for {vendorName}.
        </p>
        
        {overallGrade && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex flex-col items-center">
            <p className="text-lg mb-2">Overall Grade</p>
            <Badge 
              className={`text-lg px-4 py-2 ${getBadgeColor(overallGrade)}`}
              variant="outline"
            >
              {overallGrade}
            </Badge>
          </div>
        )}
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Your Rating</TableHead>
              <TableHead>SolarGrade Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {answers.map((answer) => (
              <TableRow key={answer.category}>
                <TableCell className="font-medium">{answer.category}</TableCell>
                <TableCell>{renderStars(answer.rating)}</TableCell>
                <TableCell>
                  <Badge 
                    className={`${getBadgeColor(scoreToGrade(answer.rating))}`}
                    variant="outline"
                  >
                    {scoreToGrade(answer.rating)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 mb-8">
          We use your individual category ratings to calculate standardized SolarGrade letter grades. 
          This ensures every company is evaluated on a consistent, trustworthy scale.
        </p>
        
        <div className="flex justify-center">
          <Button onClick={() => navigate(`/vendors/${location.state?.vendorId || ''}`)}>
            View Vendor Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewConfirmation;
