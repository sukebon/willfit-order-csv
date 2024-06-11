import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { Customer } from "@/utils/customer.type";

type Props = {
  customers: Customer[];
};

export default function OrderCustomerSelect({ customers }: Props) {
  const setCustomerId = useStore((state) => state.setCustomerId);

  return (
    <Select onValueChange={(e) => setCustomerId(e)} >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="顧客選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.customerName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}