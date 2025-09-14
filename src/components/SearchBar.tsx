"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { IoSearch } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";

const SearchBar = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [location, setLocation] = React.useState("");
  const [suggestions] = React.useState([
    "Toronto, Canada",
    "New York, USA",
    "London, UK",
  ]);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [adults, setAdults] = React.useState(0);
  const [children, setChildren] = React.useState(0);
  const [infants, setInfants] = React.useState(0);
  const [pets, setPets] = React.useState(0);

  const [warning, setWarning] = React.useState("");

  const increment = (setter: React.Dispatch<React.SetStateAction<number>>) =>
    setter(prev => prev + 1);
  const decrement = (setter: React.Dispatch<React.SetStateAction<number>>) =>
    setter(prev => (prev > 0 ? prev - 1 : 0));

  const guestSummary = `${adults + children + infants} ${
    adults + children + infants === 1 ? "guest" : "guests"
  }${pets > 0 ? ` +${pets} pets` : ""}`;

  const handleSearch = () => {
    if (!location.trim()) {
      setWarning("Location is required!");
      return;
    }
    if (!dateRange?.from || !dateRange?.to) {
      setWarning("Check-in and Check-out dates are required!");
      return;
    }

    setWarning(""); // clear warning if all fields are ok

    console.log({
      location,
      checkIn: dateRange.from,
      checkOut: dateRange.to,
      guests: { adults, children, infants, pets },
    });
  };

  const inputStyle =
    "flex-1 px-4 py-3 text-left rounded-lg bg-card border border-muted/30 text-ellipsis overflow-hidden whitespace-nowrap hover:bg-muted/5 transition";

  return (
    <div className="flex flex-col items-center mt-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center w-full max-w-[900px] rounded-lg bg-card shadow-sm border border-muted/30 overflow-hidden gap-2 md:gap-0">

        {/* Location */}
        <Popover modal={false}>
          <PopoverTrigger asChild>
            <Button className={inputStyle}>{location || "Where"}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-full md:w-[300px] p-3 rounded-xl bg-card shadow-md border border-muted/20">
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {suggestions
                .filter(s => s.toLowerCase().includes(location.toLowerCase()))
                .map((sugg, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/20 cursor-pointer transition"
                    onClick={() => setLocation(sugg)}
                  >
                    <CiLocationOn size={20} />
                    <div className="font-medium truncate">{sugg}</div>
                  </div>
                ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Check-in / Check-out */}
        <Popover modal={false}>
          <PopoverTrigger asChild>
            <Button className={inputStyle}>
              {mounted && dateRange?.from
                ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString() || "..."}`
                : "Check-in - Check-out"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-3 rounded-xl bg-card shadow-md border border-muted/20 w-full md:w-[400px]">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              className="rounded-lg border-none shadow-none"
            />
          </PopoverContent>
        </Popover>

        {/* Guests */}
        <Popover modal={false}>
          <PopoverTrigger asChild>
            <Button className={inputStyle}>{guestSummary || "Who"}</Button>
          </PopoverTrigger>
          <PopoverContent className="p-3 rounded-xl bg-card shadow-md border border-muted/20 w-full md:w-[280px]">
            {[
              { label: "Adults", desc: "Ages 13+", state: adults, setter: setAdults },
              { label: "Children", desc: "Ages 2–12", state: children, setter: setChildren },
              { label: "Infants", desc: "Under 2", state: infants, setter: setInfants },
              { label: "Pets", desc: "", state: pets, setter: setPets },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center py-2">
                  <div className="min-w-[70px]">
                    <h4 className="font-medium">{item.label}</h4>
                    {item.desc && (
                      <p className="text-sm text-muted-foreground truncate">{item.desc}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="shadow-none border border-muted/30"
                      onClick={() => decrement(item.setter)}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center">{item.state.toString().padStart(2, "0")}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shadow-none border border-muted/30"
                      onClick={() => increment(item.setter)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                {idx < 3 && <Separator className="border-muted/20" />}
              </div>
            ))}
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <Button
          className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition rounded-lg shadow-none border-none flex items-center justify-center mt-2 md:mt-0"
          onClick={handleSearch}
        >
          <IoSearch size={22} />
        </Button>
      </div>

      {/* Warning message */}
      {warning && (
        <p className="text-red-500 mt-3 font-medium">{warning}</p>
      )}
    </div>
  );
};

export default SearchBar;
