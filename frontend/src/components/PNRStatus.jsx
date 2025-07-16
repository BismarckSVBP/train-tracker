
import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  AlertTriangle,
  Check,
  Info,
  X,
  Ticket,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getPnrStatus } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PNRStatus = ({ initialPnr }) => {
  const [pnr, setPnr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pnrData, setPnrData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialPnr) {
      setPnr(initialPnr);
      checkPnrStatus(initialPnr);
    }
  }, [initialPnr]);

  const checkPnrStatus = async (pnrNumber) => {
    if (!pnrNumber.trim() || pnrNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit PNR number");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getPnrStatus(pnrNumber);

      if (!result) {
        setError(
          "PNR does not exist or incorrect input. Please check and try again."
        );
        setPnrData(null);
        toast.error("Invalid PNR number");
      } else if (result.trainName && result.trainName.includes("CANCELLED")) {
        setPnrData(result);
        setError(
          "Train has been canceled. Please check for alternate options."
        );
        toast.error("Train canceled");
      } else {
        setPnrData(result);
        toast.success("PNR status checked successfully");
      }
    } catch (err) {
      setError("Failed to check PNR status. Please try again.");
      setPnrData(null);
      toast.error("System error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await checkPnrStatus(pnr);
  };

  const getStatusColor = (status) => {
    if (status.startsWith("CNF")) return "text-train-on-time";
    if (status.startsWith("RAC")) return "text-train-secondary";
    return "text-train-delayed";
  };

  const getStatusBgColor = (status) => {
    if (status.startsWith("CNF")) return "bg-train-on-time/10";
    if (status.startsWith("RAC")) return "bg-train-secondary/10";
    return "bg-train-delayed/10";
  };

  const getConfirmationStatusIcon = (passenger) => {
    if (passenger.currentStatus.startsWith("CNF"))
      return <Check className="h-5 w-5 text-train-on-time" />;
    if (passenger.currentStatus.startsWith("RAC"))
      return <Info className="h-5 w-5 text-train-secondary" />;
    return <AlertTriangle className="h-5 w-5 text-train-delayed" />;
  };

  const getWaitingTypeDescription = (type) => {
    switch (type) {
      case "GNWL":
        return "General Waitlist (Highest priority for confirmation)";
      case "RLWL":
        return "Remote Location Waitlist (Medium priority)";
      case "TQWL":
        return "Tatkal Waitlist (Lower priority than GNWL)";
      case "PQWL":
        return "Pooled Quota Waitlist (For shorter journeys)";
      default:
        return "";
    }
  };

  const getRefundInfo = (pnrDetails, passenger) => {
    if (!pnrDetails.chartPrepared) return null;

    if (passenger.currentStatus.startsWith("WL")) {
      return (
        <div className="mt-2 text-sm">
          <p className="text-train-delayed font-medium">
            <X className="inline h-4 w-4 mr-1" />
            E-ticket will be automatically canceled and refunded
          </p>
        </div>
      );
    }
    return null;
  };

  const getConfirmationProbability = (probability) => {
    if (probability === undefined) return null;

    let color = "text-train-delayed";
    let bgColor = "bg-train-delayed/10";

    if (probability >= 70) {
      color = "text-train-on-time";
      bgColor = "bg-train-on-time/10";
    } else if (probability >= 40) {
      color = "text-train-secondary";
      bgColor = "bg-train-secondary/10";
    }

    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded ${bgColor} ${color} text-sm`}
      >
        <span className="font-medium">{probability}% </span>
        <span className="ml-1">Confirmation Chance</span>
      </div>
    );
  };

  const getTravelAllowed = (pnrDetails, passenger) => {
    if (
      passenger.currentStatus.startsWith("CNF") ||
      passenger.currentStatus.startsWith("RAC")
    ) {
      return (
        <span className="inline-flex items-center text-train-on-time">
          <Check className="h-4 w-4 mr-1" /> Travel Allowed
        </span>
      );
    }

    if (pnrDetails.chartPrepared && passenger.currentStatus.startsWith("WL")) {
      return (
        <span className="inline-flex items-center text-train-delayed">
          <X className="h-4 w-4 mr-1" /> Travel Not Allowed (E-ticket)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center text-train-delayed">
        <AlertTriangle className="h-4 w-4 mr-1" /> Travel Only if Confirmed
      </span>
    );
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">PNR Status</h2>
        <p className="text-muted-foreground mt-1">
          Enter your 10-digit PNR number to check your booking status
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="glass-panel overflow-hidden shadow-elevation-2">
          <div className="flex flex-col md:flex-row items-center p-2 gap-2">
            <div className="relative flex-grow w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Ticket className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                placeholder="Enter PNR number (e.g. 1234567890)"
                className="pl-10"
                disabled={isLoading}
                maxLength={10}
              />
            </div>

            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={isLoading || !pnr.trim() || pnr.length !== 10}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Check Status"
              )}
            </Button>
          </div>
        </div>
      </form>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {pnrData && !error && (
        <div className="mt-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted p-4">
            <h3 className="text-lg font-semibold">PNR Status Details</h3>
            <p className="text-sm text-muted-foreground">
              PNR: {pnrData.pnrNumber}
            </p>
          </div>

          <div className="p-4 space-y-6">
            {/* Train & Journey Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Train Details</Label>
                  <div className="mt-1 font-medium text-lg">
                    {pnrData.trainNumber} - {pnrData.trainName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Class: {pnrData.bookingClass}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>From</Label>
                    <div className="mt-1 font-medium">{pnrData.from}</div>
                    <div className="text-sm text-muted-foreground">
                      Departure: {pnrData.departureTime}
                    </div>
                  </div>

                  <div>
                    <Label>To</Label>
                    <div className="mt-1 font-medium">{pnrData.to}</div>
                    <div className="text-sm text-muted-foreground">
                      Arrival: {pnrData.arrivalTime}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Boarding</Label>
                    <div className="mt-1 font-medium">
                      {pnrData.boardingPoint}
                    </div>
                  </div>

                  <div>
                    <Label>Journey Date</Label>
                    <div className="mt-1 font-medium">
                      {pnrData.dateOfJourney}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Chart Status</Label>
                <div
                  className={`mt-1 p-3 rounded ${
                    pnrData.chartPrepared
                      ? "bg-train-on-time/10"
                      : "bg-train-secondary/10"
                  }`}
                >
                  <p
                    className={
                      pnrData.chartPrepared
                        ? "text-train-on-time font-medium"
                        : "text-train-secondary font-medium"
                    }
                  >
                    {pnrData.chartPrepared
                      ? "Chart has been prepared. The displayed status is final."
                      : "Chart not prepared yet. Current status may change before departure."}
                  </p>

                  {pnrData.waitingType && (
                    <div className="mt-2 text-sm">
                      <p className="font-medium">{pnrData.waitingType}</p>
                      <p className="text-muted-foreground">
                        {getWaitingTypeDescription(pnrData.waitingType)}
                      </p>
                    </div>
                  )}

                  {pnrData.confirmationProbability !== undefined &&
                    !pnrData.chartPrepared && (
                      <div className="mt-2">
                        {getConfirmationProbability(
                          pnrData.confirmationProbability
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div>
              <Label>Passenger Status</Label>
              <div className="mt-2 space-y-3">
                {pnrData.passengers.map((passenger) => (
                  <div
                    key={passenger.number}
                    className="p-3 border border-border rounded-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        {getConfirmationStatusIcon(passenger)}
                        <span className="ml-2 font-medium">
                          Passenger {passenger.number}
                        </span>
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-sm font-medium ${getStatusBgColor(
                          passenger.currentStatus
                        )} ${getStatusColor(passenger.currentStatus)}`}
                      >
                        {passenger.currentStatus}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Booking Status:
                        </span>
                        <span className="ml-2">{passenger.bookingStatus}</span>
                      </div>

                      <div>
                        <span className="text-muted-foreground">
                          Current Status:
                        </span>
                        <span className="ml-2">{passenger.currentStatus}</span>
                      </div>

                      {passenger.coachNumber && (
                        <div>
                          <span className="text-muted-foreground">Coach:</span>
                          <span className="ml-2">{passenger.coachNumber}</span>
                        </div>
                      )}

                      {passenger.seatNumber && (
                        <div>
                          <span className="text-muted-foreground">
                            Seat Number:
                          </span>
                          <span className="ml-2">{passenger.seatNumber}</span>
                        </div>
                      )}

                      {passenger.seatType && (
                        <div>
                          <span className="text-muted-foreground">
                            Berth Type:
                          </span>
                          <span className="ml-2">{passenger.seatType}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t border-border flex justify-between">
                      <div>{getTravelAllowed(pnrData, passenger)}</div>
                      {getRefundInfo(pnrData, passenger)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-secondary/50 dark:bg-gray-900/50 p-3 text-sm text-center text-muted-foreground">
        <p className="mb-1">Example PNR numbers for testing:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div>
            <strong>1234567890:</strong> Confirmed tickets
          </div>
          <div>
            <strong>9876543210:</strong> Waitlisted (GNWL)
          </div>
          <div>
            <strong>5678901234:</strong> RAC ticket
          </div>
          <div>
            <strong>1122334455:</strong> Partially confirmed
          </div>
          <div>
            <strong>9988776655:</strong> Tatkal waitlist
          </div>
          <div>
            <strong>4455667788:</strong> Remote location waitlist
          </div>
          <div>
            <strong>0000000000:</strong> Invalid PNR
          </div>
          <div>
            <strong>7788990011:</strong> Cancelled train
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PNRStatus;
