
import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface FundScheme {
  schemeCode: number;
  schemeName: string;
}

interface VirtualizedFundSelectProps {
  schemes: FundScheme[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFundSelect: (schemeCode: string) => void;
  loading: boolean;
  disabled: boolean;
}

const VirtualizedFundSelect: React.FC<VirtualizedFundSelectProps> = ({
  schemes,
  searchTerm,
  onSearchChange,
  onFundSelect,
  loading,
  disabled
}) => {
  // Memoized filtered schemes for performance
  const filteredSchemes = useMemo(() => {
    if (!searchTerm.trim()) return schemes.slice(0, 100); // Show only first 100 initially
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return schemes
      .filter(scheme => 
        scheme.schemeName.toLowerCase().includes(lowerSearchTerm)
      )
      .slice(0, 50); // Limit to 50 results for performance
  }, [schemes, searchTerm]);

  const ListItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const scheme = filteredSchemes[index];
    if (!scheme) return null;

    return (
      <div
        style={style}
        className="px-2 py-1 hover:bg-accent cursor-pointer text-sm"
        onClick={() => onFundSelect(scheme.schemeCode.toString())}
      >
        <div className="truncate">{scheme.schemeName}</div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Search mutual funds... (type to filter)"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full"
        disabled={loading || disabled}
      />
      
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading funds...</span>
        </div>
      ) : (
        <div className="border rounded-md">
          {filteredSchemes.length > 0 ? (
            <List
              height={300}
              itemCount={filteredSchemes.length}
              itemSize={40}
              className="scrollbar-thin"
            >
              {ListItem}
            </List>
          ) : searchTerm.trim() ? (
            <div className="p-4 text-center text-muted-foreground">
              No funds found matching "{searchTerm}"
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Start typing to search through {schemes.length} funds
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VirtualizedFundSelect;
