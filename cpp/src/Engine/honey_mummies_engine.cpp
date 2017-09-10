/* -*- Mode: C++; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4; c-file-style: "linux" -*- */
#include "honey_mummies_engine.h"

namespace HoneyMummies
{
    HoneyMummiesEng::HoneyMummiesEng():
        mb_running( true )
    {}
    
    HoneyMummiesEng::~HoneyMummiesEng()
    {}
    
    void
    HoneyMummiesEng::run()
    {
        init();
        while( mb_running )
        {
            draw();
            step();
            update();
        }
        return;
    }

    void
    HoneyMummiesEng::init()
    {}

    void
    HoneyMummiesEng::draw()
    {}

    void
    HoneyMummiesEng::update()
    {}

    void
    HoneyMummiesEng::step()
    {}
}
