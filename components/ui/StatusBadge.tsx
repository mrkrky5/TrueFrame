import { VerificationStatus } from "@/types";
import { CheckCircle2, Clock, FileEdit } from "lucide-react";
import { useDictionary } from "@/components/utils/DictionaryProvider";

interface Props {
  status: VerificationStatus;
  showIcon?: boolean;
}

const StatusBadge = ({ status, showIcon = true }: Props) => {
  const dictionary = useDictionary();
  
  const configs = {
    placeholder: { 
      label: dictionary.common.status.draft, 
      icon: FileEdit,
      className: "text-gray-400 border-gray-100" 
    },
    needs_review: { 
      label: dictionary.common.status.review, 
      icon: Clock,
      className: "text-amber-500 border-amber-100" 
    },
    verified: { 
      label: dictionary.common.status.verified, 
      icon: CheckCircle2,
      className: "text-green-500 border-green-100" 
    },
  };

  const normalizedStatus = (status || "placeholder").toLowerCase() as keyof typeof configs;
  const config = configs[normalizedStatus] || configs.placeholder;
  const Icon = config.icon || FileEdit;

  return (
    <span className={`inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-md border bg-white/50 backdrop-blur-sm ${config.className}`}>
      {showIcon && <Icon size={10} strokeWidth={3} />}
      {config.label}
    </span>
  );
};

export default StatusBadge;
