/* -*- Mode: C++; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4; c-file-style: "linux" -*- */
#ifndef HONEY_MUMMIES_PARAMS_H
#define HONEY_MUMMIES_PARAMS_H

//
#include <iostream>

namespace HoneyMummies
{
    class HoneyMummiesParams
    {
    public:

        HoneyMummiesParams();

        ~HoneyMummiesParams();

        void set_defaults();
        
        void write_params( std::ostream& ir_ostream );

        void write_binary( std::ostream& ir_ostream );

        void read_params( std::istream& ir_istream );

        void read_binary( std::istream& ir_istream );

        size_t num_fields;
        
        size_t num_boids;
        double time_step;
    };
}
#endif
