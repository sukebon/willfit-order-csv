import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/lib/firebase/client";
import { Order } from "@/utils/order.type";
import { DialogDescription } from "@radix-ui/react-dialog";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

type Props = {
  order: Order;
};

export default function CsvDownloadModal({ order }: Props) {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => { }, []);

  const handleDownloadCsv = () => {
    const { customerCode, customerName } = order;
    const details = order.terms
      .map((term) => {
        const { orderDate } = term;
        return term.details
          .map((detail) => {
            return {
              orderDate,
              customerCode,
              customerName,
              productCode: detail.productCode,
              productName: detail.productName,
              size: detail.size,
              salePrice: detail.salePrice,
              costPrice: detail.costPrice,
              quantity: detail.quantity,
            };
          })
          .filter((detail) => detail.quantity !== 0);
      })
      .flat();
    setData(details);
    handleIsCompleted();
    return;
  };

  const handleIsCompleted = async () => {
    const orderRef = doc(db, "orders", order.id);
    try {
      await updateDoc(orderRef, {
        isCompleted: true
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">CSV</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>CSV ダウンロード</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <dl className="flex">
            <dt className="w-20">コード：</dt>
            <dd>{order.customerCode}</dd>
          </dl>
          <dl className="flex">
            <dt className="w-20">顧客名：</dt>
            <dd>{order.customerName}</dd>
          </dl>
          <div className="mt-3">データの準備ができました。</div>
          <div>以下のボタンをクリックしてダウンロードしてください。</div>
        </DialogDescription>

        <DialogFooter>
          <Button type="button" className="w-full" asChild>
            <CSVLink
              data={data}
              filename={`${order.customerName}_${order.terms.at(0)?.orderDate
                }_${order.terms.at(-1)?.orderDate}`}
              onClick={handleDownloadCsv}
            >
              Download
            </CSVLink>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
