/* -*- Mode: C++; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4; c-file-style: "linux" -*- */
#ifndef HONEY_MUMMIES_ENG_H
#define HONEY_MUMMIES_ENG_H

//
#include <iostream>

//

namespace HoneyMummies
{
    class HoneyMummiesEng
    {
    public:
        HoneyMummiesEng();
        ~HoneyMummiesEng();
        
        void run();
        
    private:
        void init();
        void draw();
        void update();
        void step();

        bool mb_running;
    };
}
#endif
