/* -*- Mode: C++; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4; c-file-style: "linux" -*- */
#include "honey_mummies_params.h"

namespace HoneyMummies
{
    HoneyMummiesParams::HoneyMummiesParams():
        num_fields( 2 )
    {
        set_defaults();
    }

    HoneyMummiesParams::~HoneyMummiesParams(){}

    void
    HoneyMummiesParams::set_defaults()
    {
        num_boids = 1;
        time_step = 1.0;
    }

    void
    HoneyMummiesParams::write_params( std::ostream& ir_ostream )
    {

    }

    void
    HoneyMummiesParams::write_binary( std::ostream& ir_ostream )
    {

    }

    void
    HoneyMummiesParams::read_params( std::istream& ir_istream )
    {

    }

    void
    HoneyMummiesParams::read_binary( std::istream& ir_istream )
    {

    };
}
