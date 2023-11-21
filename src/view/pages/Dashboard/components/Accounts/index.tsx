import { EyeIcon } from "../../../../components/icons/EyeIcon";

import { Swiper, SwiperSlide } from "swiper/react";

import 'swiper/css'

import { useAccountsController } from "./useAccountsController";
import { AccountsSliderNavigation } from "./AccountsSliderNavigation";
import { AccountCard } from "./AccountCard";
import { formatCurrency } from "../../../../../app/utils/formatCurrency";
import { cn } from "../../../../../app/utils/cn";
import { Spinner } from "../../../../components/Spinner";
import { PlusIcon } from "@radix-ui/react-icons";

export function Accounts() {
  const { setSliderState, sliderState, windowWidth, areValuesVisible, toggleValuesVisibility, isLoading, accounts, openNewAccountModal } = useAccountsController();

  return (
    <div className="bg-teal-900 rounded-2xl w-full h-full md:p-10 px-4 py-8 flex flex-col">
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="text-teal-950/50 fill-white w-10 backdrop-hue-rotate-180" />
        </div>
      )}
      {!isLoading && (
        <>
          <div className="">
            <span className="tracking-[-0.5px] text-white block">Saldo Total</span>
            <div className="flex items-center gap-2">
              <strong className={cn("text-2xl tracking-[-1px] text-white", !areValuesVisible && "blur-md")}>{formatCurrency(1000)}</strong>
              <button className="w-8 h-8 flex items-center justify-center" onClick={toggleValuesVisibility}>
                <EyeIcon open={!areValuesVisible} />
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end mt-10 md:mt-0">
            {accounts.length === 0 && (
              <>
                <div className="mb-4" slot="container-start">
                  <strong className="text-white  tracking-[-1px] text-lg font-bold">Minhas contas </strong>

                </div>
                <button
                  onClick={openNewAccountModal}
                  className="mt-4 h-52 rounded-2xl border-2 border-dashed border-teal-600 flex flex-col items-center justify-center gap-4 text-white">
                  <div className="w-11 h-11 rounded-full border-2 border-dashed border-white flex items-center justify-center">
                    <PlusIcon className="w-6 h-6" />
                  </div>
                  <span className="tracking-[-0.5px] font-medium block w-32 text-center">Cadastre uma nova conta</span>
                </button>
              </>
            )}

            {accounts.length > 0 && (
              <div>
                <Swiper
                  spaceBetween={16}
                  slidesPerView={windowWidth >= 500 ? 2.1 : 1.1}
                  onSlideChange={swiper => {
                    setSliderState({
                      isBeginning: swiper.isBeginning,
                      isEnd: swiper.isEnd
                    })
                  }}
                >
                  <div className="flex items-center justify-between mb-4" slot="container-start">
                    <strong className="text-white  tracking-[-1px] text-lg font-bold">Minhas contas </strong>

                    <AccountsSliderNavigation
                      isBeginning={sliderState.isBeginning}
                      isEnd={sliderState.isEnd}
                    />
                  </div>
                  <SwiperSlide>
                    <AccountCard color="#7950f2" name="Nubank" balance={1023.23} />
                  </SwiperSlide>
                  <SwiperSlide>
                    <AccountCard color="#7950f2" name="Nubank" balance={1023.23} />
                  </SwiperSlide>
                  <SwiperSlide>
                    <AccountCard color="#7950f2" name="Nubank" balance={1023.23} />
                  </SwiperSlide>
                  <SwiperSlide>
                    <AccountCard color="#7950f2" name="Nubank" balance={1023.23} />
                  </SwiperSlide>
                </Swiper>
              </div>
            )}

          </div>

        </>
      )}
    </div >
  );
}